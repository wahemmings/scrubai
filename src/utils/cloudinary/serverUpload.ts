
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUploadSignature, secureUploadToCloudinary } from "./uploadService";

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
