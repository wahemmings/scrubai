
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
  
  // IMPORTANT FIX: Use folder from signature data, don't override it
  formData.append('folder', signatureData.folder);
  
  // These fields are only added if they exist in the signature data
  // IMPORTANT FIX: Use publicId instead of public_id to match what's in the signature
  if (signatureData.publicId) {
    console.log("Using public_id:", signatureData.publicId);
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
  
  // Add detailed logging for better debugging
  console.log("Cloudinary upload request:", {
    cloudName: cloudName,
    hasAPIKey: !!signatureData.apiKey,
    hasSignature: !!signatureData.signature,
    timestamp: signatureData.timestamp,
    folder: signatureData.folder,
    publicId: signatureData.publicId || 'auto-generated',
    uploadPreset: signatureData.uploadPreset || 'default'
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
