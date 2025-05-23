# Cloudinary Signature Issue - Advanced Troubleshooting Guide

## Current Issue
Despite implementing our fix for the parameter name mismatch (`api_key` vs `apiKey`), we're still seeing this error:
```
Cloudinary connection failed
Failed to get upload signature: Invalid signature data structure returned from edge function
```

## Diagnosis Steps

### 1. Run Advanced Diagnostics Tool
I've created a comprehensive diagnostics tool to help pinpoint exactly what's happening with the signature validation:

1. Go to http://localhost:8086/documents
2. Click "Test Cloudinary" button
3. Open "Advanced Diagnostics" tab
4. Click "Run Advanced Diagnostics" button (red button)
5. Examine the response structure carefully

### 2. Check Browser Console
Our enhanced logging will give detailed information about:
- The exact structure of the response
- Which validation checks are failing
- Parameter name and value details

### 3. Potential Issues to Look For

#### Case 1: Edge Function Not Returning `api_key`
- **Signs**: The diagnostic tool will show `api_keyPresent: false` 
- **Solution**: Update the edge function to return the property correctly:
  ```typescript
  // Make sure this line exists in the edge function
  api_key: apiKey, 
  ```

#### Case 2: Edge Function Not Returning `cloudName`
- **Signs**: Diagnostics will show "Missing cloudName"
- **Solution**: The edge function should set `cloudName` not `cloud_name`

#### Case 3: cloudName Case Mismatch
- **Signs**: Edge function returns `cloudname` instead of `cloudName`
- **Solution**: Correct the property name case

#### Case 4: Edge Function Not Being Called
- **Signs**: No network request to the edge function in browser network tab
- **Solution**: Check authentication and URL configuration

### 4. Quick Fixes to Try

#### Fix A: Force All Parameter Names to Match
```typescript
// In the edge function:
const responseData = {
  signature,
  timestamp,
  cloudName,
  api_key: apiKey,
  apiKey: apiKey, // Add duplicate with both names
  // ...
};
```

#### Fix B: Map Parameters in Client
```typescript
// In cloudinaryUpload.ts after receiving the response:
responseData = {
  ...responseData,
  cloudName: responseData.cloudName || responseData.cloud_name,
  apiKey: responseData.apiKey || responseData.api_key,
  api_key: responseData.api_key || responseData.apiKey,
};
```

#### Fix C: Update Supabase Edge Function
If the edge function is out of sync with our current code:
1. Get the current code from supabase
2. Make the necessary updates
3. Re-deploy the function

## Testing Strategy
1. Run the Advanced Diagnostics tool
2. Apply the appropriate fix based on the diagnostics
3. Push changes to GitHub
4. Re-deploy the edge function if needed
5. Test the upload functionality again

Remember: The key issue is likely a parameter name mismatch between what the edge function returns and what our validation expects. The advanced diagnostics tool will help pinpoint the exact parameter that's missing or mismatched.
