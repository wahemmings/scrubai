
import config from "@/config";
import { v4 as uuidv4 } from "uuid";
import { uploadToServer } from "@/utils/cloudinaryUpload";
import { markUploadStart } from "@/services/instrumentation";

// Validate file type
export const isValidFileType = (file: File, type: "text" | "document" | "image") => {
  const supportedFormats = config.processing.supportedFormats[type];
  const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return supportedFormats.includes(fileExt);
};

// Validate file size
export const isValidFileSize = (file: File) => {
  return file.size <= config.processing.maxFileSizeMB * 1024 * 1024;
};

// Process and upload file
export const processFile = async (
  file: File, 
  type: "document" | "image", 
  user: any, 
  setCurrentJob: (job: any) => void, 
  decrementCredits: (amount: number) => void
) => {
  // Generate a unique job ID
  const jobId = uuidv4();
  
  // Start tracking time-to-first-value
  markUploadStart(jobId);
  
  // Create a job entry in our store
  setCurrentJob({
    id: jobId,
    progress: 0,
    status: 'pending',
    message: 'Preparing to process...'
  });
  
  // For text and small documents, use WebAssembly processing (client-first approach)
  if (type === "document" && file.size < 1 * 1024 * 1024 && config.features.enableWasmProcessing) {
    // For smaller documents, we don't need to upload to Cloudinary
    decrementCredits(1);
    return { jobId, data: { fileName: file.name, fileSize: file.size } };
  } else {
    // For larger files or images, use server processing
    const uploadResult = await uploadToServer(file, jobId, user);
    decrementCredits(type === "image" ? 2 : 1); // Images cost more credits
    return { jobId, data: uploadResult };
  }
};
