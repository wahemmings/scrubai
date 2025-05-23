
import config from "@/config";

// Test direct access to Cloudinary
export const testDirectCloudinaryAccess = async (): Promise<any> => {
  try {
    const cloudName = config.externalServices.cloudinary.cloudName;
    if (!cloudName) {
      return { 
        success: false, 
        error: "No Cloudinary cloud name configured" 
      };
    }
    
    // Try to fetch a simple resource from Cloudinary to test connection
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`;
    
    const response = await fetch(url, {
      method: 'HEAD',
    });
    
    if (response.ok) {
      return { 
        success: true,
        message: "Successfully connected to Cloudinary",
        details: {
          url,
          status: response.status,
          statusText: response.statusText,
        }
      };
    } else {
      return {
        success: false,
        error: `Failed to connect to Cloudinary: ${response.status} ${response.statusText}`,
        details: {
          url,
          status: response.status,
          statusText: response.statusText,
        }
      };
    }
  } catch (error) {
    console.error("Direct Cloudinary test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
