
import { toast } from 'sonner';
import { getUploadSignature } from './uploadSignature';
import { secureUploadToCloudinary } from './fileUpload';

// Create a simple test file using the Canvas API
const createTestFile = (text: string = 'Test file'): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // Fall back to a simple blob if canvas is not available
      const blob = new Blob([text], { type: 'text/plain' });
      resolve(new File([blob], 'test-file.txt', { type: 'text/plain' }));
      return;
    }
    
    // Draw a simple test image
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Generated: ' + new Date().toISOString(), canvas.width / 2, canvas.height / 2 + 30);
    
    // Convert the canvas to a blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'test-image.png', { type: 'image/png' });
        resolve(file);
      } else {
        // Fallback if toBlob fails
        const textBlob = new Blob([text], { type: 'text/plain' });
        resolve(new File([textBlob], 'test-file.txt', { type: 'text/plain' }));
      }
    }, 'image/png');
  });
};

// Test upload to Cloudinary
export const uploadTestFile = async (user: any) => {
  if (!user) {
    toast.error('Authentication required', {
      description: 'You must be logged in to test file uploads'
    });
    return null;
  }
  
  toast('Testing file upload...', {
    description: 'Generating test file and uploading'
  });
  
  try {
    // Create a test file
    const testFile = await createTestFile('ScrubAI Cloudinary Test');
    
    // Get upload signature
    const signatureData = await getUploadSignature(user);
    
    // Add a unique test identifier
    const testId = `test_${Date.now().toString(36)}`;
    signatureData.publicId = `${signatureData.folder}/test/${testId}`;
    
    // Upload the test file
    const result = await secureUploadToCloudinary(testFile, signatureData);
    
    toast.success('Test upload successful', {
      description: 'The test file was successfully uploaded'
    });
    
    console.log('Test upload result:', {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    });
    
    return result;
  } catch (error) {
    console.error('Test upload failed:', error);
    toast.error('Test upload failed', {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Test connection to Cloudinary
export const testCloudinaryConnection = async (user: any) => {
  if (!user) {
    toast.error('Authentication required', {
      description: 'You must be logged in to test the connection'
    });
    return null;
  }
  
  toast('Testing Cloudinary connection...', {
    description: 'Requesting upload signature'
  });
  
  try {
    // Simply request a signature to test the connection
    const signatureData = await getUploadSignature(user);
    
    toast.success('Connection test successful', {
      description: 'Successfully connected to Cloudinary'
    });
    
    return { success: true, signatureData };
  } catch (error) {
    console.error('Connection test failed:', error);
    toast.error('Connection test failed', {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
