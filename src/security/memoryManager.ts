
/**
 * Memory Manager Utility
 * 
 * Handles efficient memory usage and garbage collection for uploads
 * Implements auto-purging of in-memory files to prevent memory leaks
 */

interface MemoryStats {
  uploadedFilesInMemory: number;
  totalBytesInMemory: number;
  lastGCTime: Date | null;
}

const memoryState: MemoryStats = {
  uploadedFilesInMemory: 0,
  totalBytesInMemory: 0,
  lastGCTime: null
};

// In-memory file storage with weak references
const fileMap = new Map<string, WeakRef<Blob | File>>();
const fileRegistry = new FinalizationRegistry<string>((fileId) => {
  // Clean up file entry when object is garbage collected
  if (fileMap.has(fileId)) {
    fileMap.delete(fileId);
    memoryState.uploadedFilesInMemory--;
    console.log(`File ${fileId} was auto-purged by garbage collector`);
  }
});

/**
 * Registers a file in memory for tracking
 */
export const registerInMemoryFile = (fileId: string, fileData: File | Blob) => {
  // Create weak reference to allow garbage collection
  const weakRef = new WeakRef(fileData);
  fileMap.set(fileId, weakRef);
  fileRegistry.register(fileData, fileId);
  
  memoryState.uploadedFilesInMemory++;
  memoryState.totalBytesInMemory += fileData.size;
  
  console.log(`File ${fileId} registered in memory (${fileData.size} bytes)`);
  
  // Auto-purge if we exceed memory thresholds
  if (memoryState.uploadedFilesInMemory > 5 || memoryState.totalBytesInMemory > 50 * 1024 * 1024) {
    purgeOldestFiles();
  }
};

/**
 * Purges files from memory
 */
export const purgeFile = (fileId: string) => {
  if (fileMap.has(fileId)) {
    const fileRef = fileMap.get(fileId);
    const file = fileRef?.deref();
    if (file) {
      memoryState.totalBytesInMemory -= file.size;
    }
    fileMap.delete(fileId);
    memoryState.uploadedFilesInMemory--;
    console.log(`File ${fileId} manually purged from memory`);
  }
};

/**
 * Purges the oldest files from memory when thresholds are reached
 */
const purgeOldestFiles = () => {
  // In a real implementation, we would track file age and purge oldest first
  // For this simple implementation, we'll just remove some files
  const keysToRemove = Array.from(fileMap.keys()).slice(0, 2);
  keysToRemove.forEach(purgeFile);
  
  // Track garbage collection
  memoryState.lastGCTime = new Date();
  console.log('Memory cleanup performed', memoryState);
};

/**
 * Initialize the memory manager
 */
export const initMemoryManager = () => {
  // Set up periodic cleanup
  const cleanupInterval = setInterval(() => {
    if (memoryState.uploadedFilesInMemory > 0) {
      console.log('Periodic memory check', memoryState);
      
      // Force garbage collection if supported by environment
      if (window.gc) {
        try {
          window.gc();
        } catch (e) {
          console.warn('Failed to force garbage collection');
        }
      }
    }
  }, 60000); // Check every minute
  
  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval);
  };
};

// Export memory stats for monitoring
export const getMemoryStats = (): Readonly<MemoryStats> => {
  return { ...memoryState };
};
