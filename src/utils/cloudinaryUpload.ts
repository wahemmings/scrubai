
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get secure upload signature from Supabase edge function
export const getUploadSignature = async (user: any) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  
  try {
    console.log("Requesting upload signature for user:", user.id);
    
    // Check that the user has a valid session token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No valid session token found");
    }
    
    // Add detailed logging for edge function call
    console.log("Calling generate-upload-signature edge function");
    
    // More detailed request logging
    console.log("Request details:", {
      method: 'POST',
      user_id: user.id,
      has_access_token: !!session?.access_token?.substring(0, 10) + '...'
    });
    
    const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.id })
    });
    
    console.log("Edge function response received", { 
      hasData: !!data, 
      hasError: !!error,
      errorDetails: error ? JSON.stringify(error) : null
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Edge function error: ${error.message || JSON.stringify(error)}`);
    }
    
    if (!data) {
      console.error("No signature data returned from edge function");
      throw new Error("No signature data returned from edge function");
    }
    
    // Check if the response contains the expected fields
    if (!data.signature || !data.cloudName || !data.apiKey) {
      console.error("Invalid signature data structure:", data);
      throw new Error("Invalid signature data structure returned from edge function");
    }
    
    console.log("Upload signature received successfully:", {
      cloudName: data.cloudName,
      folder: data.folder,
      uploadPreset: data.uploadPreset || 'scrubai_secure',
      timestamp: data.timestamp
    });
    return data;
  } catch (error) {
    console.error("Edge function request error:", error);
    throw new Error(`Failed to get upload signature: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Secure file upload to Cloudinary
export const secureUploadToCloudinary = async (file: File, signatureData: any) => {
  if (!signatureData || !signatureData.signature) {
    throw new Error("Invalid signature data");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', signatureData.timestamp.toString());
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);
  
  // These fields are only added if they exist in the signature data
  if (signatureData.publicId) {
    formData.append('public_id', signatureData.publicId);
  }
  
  if (signatureData.uploadPreset) {
    formData.append('upload_preset', signatureData.uploadPreset);
  }
  
  const cloudName = signatureData.cloudName;
  
  if (!cloudName) {
    throw new Error("Cloud name is missing in signature data");
  }
  
  console.log("Uploading to Cloudinary with params:", {
    cloudName,
    folder: signatureData.folder,
    preset: signatureData.uploadPreset || 'scrubai_secure',
    publicId: signatureData.publicId || 'auto-generated'
  });
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload failed:", errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Cloudinary upload successful:", {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Upload file to server with secure Cloudinary process
export const uploadToServer = async (file: File, jobId: string, user: any) => {
  toast("Processing file", {
    description: "Your file is being processed on our secure servers."
  });
  
  try {
    console.log("Starting secure upload process for job:", jobId);
    
    // Get secure upload signature
    const signatureData = await getUploadSignature(user);
    
    // Upload to Cloudinary securely
    const uploadResult = await secureUploadToCloudinary(file, signatureData);
    
    // Update the job in the database
    const { error: jobError } = await supabase
      .from('jobs')
      .update({
        original_content_path: uploadResult.public_id,
        file_name: file.name,
        file_size: file.size
      })
      .eq('id', jobId);
    
    if (jobError) {
      throw new Error(`Failed to update job: ${jobError.message}`);
    }
    
    toast.success("File uploaded successfully", {
      description: "Your file has been uploaded to our secure cloud storage."
    });
    
    return {
      fileName: file.name,
      fileSize: file.size,
      contentPath: uploadResult.public_id,
      url: uploadResult.secure_url,
      expiresAt: signatureData.expiresAt
    };
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload failed", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
};
