/**
 * Memory Manager for handling secure upload processes
 * Prevents memory leaks and ensures data is properly cleared after processing
 */

interface MemoryItem {
  data: Uint8Array | ArrayBuffer | Blob;
  timestamp: number;
  size: number;
}

// Maximum time to keep data in memory (30 minutes)
const MAX_TTL_MS = 30 * 60 * 1000;

// Map to track items in memory with timeout handles for cleanup
const memoryItems = new Map<string, {
  item: MemoryItem,
  timeoutId: ReturnType<typeof setTimeout>
}>();

// Track objects using WeakRef if available (for more modern browsers)
let weakRefs: Map<string, any> | null = null;
let finalizationRegistry: any | null = null;

// Check if browser supports WeakRef and FinalizationRegistry
const hasWeakRefSupport = typeof globalThis.WeakRef !== 'undefined' && 
  typeof globalThis.FinalizationRegistry !== 'undefined';

if (hasWeakRefSupport) {
  weakRefs = new Map();
  finalizationRegistry = new globalThis.FinalizationRegistry((id: string) => {
    console.log(`Object with ID ${id} has been garbage-collected`);
    memoryItems.delete(id);
  });
}

/**
 * Initializes the memory manager
 */
export const initMemoryManager = () => {
  // Set up periodic cleanup check every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    
    // Check for expired items
    memoryItems.forEach(({ item, timeoutId }, id) => {
      if (now - item.timestamp > MAX_TTL_MS) {
        clearTimeout(timeoutId);
        memoryItems.delete(id);
        console.log(`Item ${id} cleared due to expiration`);
      }
    });
    
    // Force garbage collection on supported platforms
    if (typeof window.gc === 'function') {
      try {
        window.gc();
        console.log('Forced garbage collection');
      } catch (e) {
        console.warn('Failed to force garbage collection');
      }
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval);
    memoryItems.clear();
  };
};

/**
 * Registers data in memory with automatic cleanup
 * @param data The data to store
 * @param id Optional ID for the data
 * @returns The ID assigned to the data
 */
export const registerMemoryItem = (
  data: Uint8Array | ArrayBuffer | Blob, 
  id: string = crypto.randomUUID()
): string => {
  // Clear previous item with same ID if it exists
  if (memoryItems.has(id)) {
    const { timeoutId } = memoryItems.get(id)!;
    clearTimeout(timeoutId);
  }
  
  // Create new memory item
  const item: MemoryItem = {
    data,
    timestamp: Date.now(),
    size: data instanceof Blob ? data.size : data.byteLength
  };
  
  // Set up automatic cleanup
  const timeoutId = setTimeout(() => {
    memoryItems.delete(id);
    console.log(`Item ${id} automatically cleared after timeout`);
  }, MAX_TTL_MS);
  
  // Store the item
  memoryItems.set(id, { item, timeoutId });
  
  // Register with FinalizationRegistry if supported
  if (hasWeakRefSupport && weakRefs && finalizationRegistry) {
    const weakRef = new globalThis.WeakRef(data);
    weakRefs.set(id, weakRef);
    finalizationRegistry.register(data, id);
  }
  
  console.log(`Registered memory item ${id} of size ${item.size} bytes`);
  return id;
};

/**
 * Gets data from memory
 * @param id The ID of the data
 * @returns The data or null if not found
 */
export const getMemoryItem = (id: string): MemoryItem['data'] | null => {
  const entry = memoryItems.get(id);
  if (!entry) return null;
  
  // Update timestamp to extend TTL
  entry.item.timestamp = Date.now();
  return entry.item.data;
};

/**
 * Explicitly clears data from memory
 * @param id The ID of the data to clear
 */
export const clearMemoryItem = (id: string): boolean => {
  if (!memoryItems.has(id)) return false;
  
  const { timeoutId } = memoryItems.get(id)!;
  clearTimeout(timeoutId);
  memoryItems.delete(id);
  
  if (weakRefs) weakRefs.delete(id);
  
  console.log(`Explicitly cleared memory item ${id}`);
  return true;
};

/**
 * Gets the total size of all items in memory
 */
export const getMemoryUsage = (): number => {
  let totalSize = 0;
  memoryItems.forEach(({ item }) => {
    totalSize += item.size;
  });
  return totalSize;
};
