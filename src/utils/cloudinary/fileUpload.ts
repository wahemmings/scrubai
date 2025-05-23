
// Secure file upload to Cloudinary
export const secureUploadToCloudinary = async (file: File, signatureData: any) => {
  if (!signatureData || !signatureData.signature) {
    console.error("Missing signature data:", signatureData);
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
    console.error("Cloud name missing from signature data:", signatureData);
    throw new Error("Cloud name is missing in signature data");
  }
  
  console.log("Preparing Cloudinary upload with:", {
    cloudName,
    apiKeyProvided: !!signatureData.apiKey,
    signatureProvided: !!signatureData.signature,
    uploadPreset: signatureData.uploadPreset || 'default',
    fileName: file.name,
    fileSize: file.size
  });
  
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
