// filepath: /Users/CXR0514/Downloads/scrubai-main/src/utils/cloudinaryUpload.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get secure upload signature from Supabase edge function
export const getUploadSignature = async (user: any, options: any = {}) => {
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
      has_access_token: !!session?.access_token,
      token_preview: session?.access_token ? `${session.access_token.substring(0, 10)}...` : 'none',
      token_length: session?.access_token?.length || 0
    });
    
    // Get base URL for edge functions 
    const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || null;
    
    // Try direct fetch first if we have a function URL, otherwise fall back to supabase client
    try {
      let responseData;
      
      if (functionUrl) {
        console.log("Using direct fetch to edge function at:", functionUrl + "/generate-upload-signature");
        
        // Try direct fetch first (sometimes more reliable in development)
        const response = await fetch(`${functionUrl}/generate-upload-signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'Origin': window.location.origin
          },
          body: JSON.stringify({ user_id: user.id, ...options })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Direct fetch error:", response.status, errorText);
          throw new Error(`Direct edge function error: ${response.status} ${errorText || response.statusText}`);
        }
        
        responseData = await response.json();
      } else {
        // Otherwise use Supabase client 
        console.log("Using Supabase client for edge function invocation");
        const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ user_id: user.id, ...options })
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Edge function error: ${error.message || JSON.stringify(error)}`);
        }
        
        if (!data) {
          console.error("No signature data returned from edge function");
          throw new Error("No signature data returned from edge function");
        }
        
        responseData = data;
      }
      
      // FIX B: Normalize parameter names to handle inconsistencies from the edge function
      // This ensures all needed parameters are available regardless of naming convention
      responseData = {
        ...responseData,
        // Handle cloud name variations
        cloudName: responseData.cloudName || responseData.cloud_name || responseData.cloudname,
        // Handle API key variations
        apiKey: responseData.apiKey || responseData.api_key,
        api_key: responseData.api_key || responseData.apiKey,
        // Handle upload preset variations
        upload_preset: responseData.upload_preset || responseData.uploadPreset,
        uploadPreset: responseData.uploadPreset || responseData.upload_preset,
      };
      
      // Check if the response contains the expected fields
      // Note: Edge function returns 'api_key' (Cloudinary standard), but we also support 'apiKey' for backward compatibility
      console.group("🔍 Validating Signature Response");
      console.log("Response Data AFTER normalization:", responseData);
      console.log("Validation Checks:", {
        hasSignature: !!responseData.signature,
        hasCloudName: !!responseData.cloudName,
        hasApiKey: !!responseData.apiKey,
        hasApi_key: !!responseData.api_key,
        apiKeyValidation: (!responseData.api_key && !responseData.apiKey) ? "FAILED" : "PASSED"
      });
      console.log("Available parameter names:", Object.keys(responseData));
      
      if (!responseData.signature || !responseData.cloudName || (!responseData.api_key && !responseData.apiKey)) {
        console.error("❌ Invalid signature data structure:", responseData);
        console.error("Expected: signature, cloudName, and either api_key or apiKey");
        console.error("Received keys:", Object.keys(responseData));
        console.groupEnd();
        throw new Error("Invalid signature data structure returned from edge function");
      }
      console.log("✅ Signature validation passed");
      console.groupEnd();
      
      console.log("Upload signature received successfully:", {
        cloudName: responseData.cloudName,
        api_key: responseData.api_key || responseData.apiKey,
        folder: responseData.folder,
        upload_preset: responseData.upload_preset || responseData.uploadPreset,
        timestamp: responseData.timestamp
      });
      
      return responseData;
    } catch (error) {
      console.error("Edge function request error:", error);
      throw new Error(`Failed to get upload signature: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error getting upload signature:", error);
    throw error;
  }
};

// Secure file upload to Cloudinary
export const secureUploadToCloudinary = async (file: File, signatureData: any) => {
  console.group("🚀 Cloudinary Upload Process");
  console.log("Starting secure upload to Cloudinary");
  
  // First, normalize the signature data to ensure all required parameters exist
  const normalizedSignatureData = {
    ...signatureData,
    api_key: signatureData.api_key || signatureData.apiKey,
    apiKey: signatureData.apiKey || signatureData.api_key,
    cloudName: signatureData.cloudName || signatureData.cloud_name || signatureData.cloudname,
    upload_preset: signatureData.upload_preset || signatureData.uploadPreset,
    uploadPreset: signatureData.uploadPreset || signatureData.upload_preset,
  };
  
  console.log("Normalized signature data:", normalizedSignatureData);
  
  if (!normalizedSignatureData.signature) {
    console.error("Missing signature in data:", normalizedSignatureData);
    console.groupEnd();
    throw new Error("Invalid signature data: Missing signature");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // CRITICAL: Must use the exact parameter names that Cloudinary expects
  // Use api_key directly if available, otherwise fall back to apiKey for backward compatibility
  formData.append('api_key', normalizedSignatureData.api_key);
  formData.append('timestamp', normalizedSignatureData.timestamp.toString());
  formData.append('signature', normalizedSignatureData.signature);
  
  // Only append folder if it exists
  if (normalizedSignatureData.folder) {
    formData.append('folder', normalizedSignatureData.folder);
  }
  
  console.log("FormData prepared with parameters:", {
    api_key: normalizedSignatureData.api_key ? 'PRESENT' : 'MISSING',
    timestamp: normalizedSignatureData.timestamp ? 'PRESENT' : 'MISSING',
    signature: normalizedSignatureData.signature ? 'PRESENT' : 'MISSING',
    folder: normalizedSignatureData.folder ? 'PRESENT' : 'MISSING'
  });
  
  // These fields are only added if they exist in the signature data
  // IMPORTANT: We try the correct parameter name first, then fall back to the legacy one
  // for backward compatibility
  if (normalizedSignatureData.public_id || normalizedSignatureData.publicId) {
    const publicId = normalizedSignatureData.public_id || normalizedSignatureData.publicId;
    formData.append('public_id', publicId);
    console.log("Added public_id to upload:", publicId);
  }
  
  if (normalizedSignatureData.upload_preset) {
    formData.append('upload_preset', normalizedSignatureData.upload_preset);
    console.log("Added upload_preset to upload:", normalizedSignatureData.upload_preset);
  }
  
  const cloudName = normalizedSignatureData.cloudName;
  
  if (!cloudName) {
    console.error("Cloud name missing from signature data:", normalizedSignatureData);
    console.groupEnd();
    throw new Error("Cloud name is missing in signature data");
  }
  
  console.log("Preparing Cloudinary upload with:", {
    cloudName,
    apiKeyProvided: !!normalizedSignatureData.api_key,
    signatureProvided: !!normalizedSignatureData.signature,
    uploadPreset: normalizedSignatureData.upload_preset || 'default',
    fileName: file.name,
    fileSize: file.size
  });
  
  console.log("Uploading to Cloudinary with params:", {
    cloudName,
    folder: normalizedSignatureData.folder,
    preset: normalizedSignatureData.upload_preset || 'scrubai_secure',
    publicId: normalizedSignatureData.public_id || normalizedSignatureData.publicId || 'auto-generated'
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
    console.groupEnd();
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    console.groupEnd();
    throw error;
  }
};

// Upload file to server with secure Cloudinary process
export const uploadToServer = async (file: File, jobId: string, user: any) => {
  toast("Processing file", {
    description: "Your file is being processed on our secure servers."
  });
  
  try {
    // Get upload signature from edge function
    console.log(`Getting upload signature for job ${jobId}`);
    
    // Create the public ID for the file based on the job ID
    const publicId = `scrubai/${user.id}/${jobId}`;
    
    // Include the public_id in the payload to ensure it's part of the signature
    const requestOptions = {
      user_id: user.id,
      public_id: publicId,
    };
    
    // Get a signature that includes the public_id in the calculation
    const signatureData = await getUploadSignature(user, requestOptions);
    
    // Verify the public ID is properly set
    console.log(`Uploading file for job ${jobId} to Cloudinary with public_id: ${publicId}`);
    const uploadResult = await secureUploadToCloudinary(file, signatureData);
    
    console.log("Upload complete:", uploadResult);
    
    // Return the result data needed by the client
    return {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      contentType: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      folder: signatureData.folder,
      jobId
    };
  } catch (error) {
    console.error("Upload to server failed:", error);
    toast.error("Upload failed", { 
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    throw error;
  }
};
