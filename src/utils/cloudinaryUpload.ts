
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Get secure upload signature from Supabase edge function
export const getUploadSignature = async (user: any) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  
  const { data, error } = await supabase.functions.invoke('generate-upload-signature', {
    method: 'POST'
  });
  
  if (error) throw error;
  return data;
};

// Secure file upload to Cloudinary
export const secureUploadToCloudinary = async (file: File, signatureData: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', signatureData.timestamp.toString());
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);
  formData.append('public_id', signatureData.publicId);
  formData.append('upload_preset', signatureData.uploadPreset);
  
  const cloudName = signatureData.cloudName;
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  
  return await response.json();
};

// Upload file to server with secure Cloudinary process
export const uploadToServer = async (file: File, jobId: string, user: any) => {
  toast({
    title: "Processing larger file",
    description: "Your file is being processed on our secure servers."
  });
  
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
  
  return {
    fileName: file.name,
    fileSize: file.size,
    contentPath: uploadResult.public_id,
    expiresAt: signatureData.expiresAt
  };
};
