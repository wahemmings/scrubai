
import { toast } from "sonner";
import { getUploadSignature } from "./uploadSignature";
import { secureUploadToCloudinary } from "./fileUpload";

// Upload file to server with secure Cloudinary process
export const uploadToServer = async (file: File, jobId: string, user: any) => {
  toast("Processing file", {
    description: "Your file is being processed on our secure servers."
  });
  
  try {
    // Get upload signature from edge function
    console.log(`Getting upload signature for job ${jobId}`);
    const signatureData = await getUploadSignature(user);
    
    // Set the public ID for the file based on the job ID
    signatureData.publicId = `${signatureData.folder}/${jobId}`;
    
    // Upload the file to Cloudinary
    console.log(`Uploading file for job ${jobId} to Cloudinary`);
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
