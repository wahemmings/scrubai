
import { create } from 'zustand';

// Define our store state types
interface JobProgress {
  id: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

// Define our store state
interface AppState {
  // User credits
  credits: number;
  
  // Current job processing state
  currentJob: JobProgress | null;
  
  // Job history
  jobHistory: JobProgress[];
  
  // Actions
  setCredits: (credits: number) => void;
  decrementCredits: (amount?: number) => void;
  setCurrentJob: (job: JobProgress | null) => void;
  updateJobProgress: (id: string, progress: number, status?: 'pending' | 'processing' | 'completed' | 'failed', message?: string) => void;
  addJobToHistory: (job: JobProgress) => void;
  clearJobHistory: () => void;
}

// Create the store
export const useAppStore = create<AppState>()((set) => ({
  credits: 0,
  currentJob: null,
  jobHistory: [],
  
  setCredits: (credits) => set({ credits }),
  
  decrementCredits: (amount = 1) => set((state) => ({ 
    credits: Math.max(0, state.credits - amount) 
  })),
  
  setCurrentJob: (job) => set({ currentJob: job }),
  
  updateJobProgress: (id, progress, status, message) => set((state) => {
    // Update current job if it matches the ID
    if (state.currentJob && state.currentJob.id === id) {
      return { 
        currentJob: { 
          ...state.currentJob, 
          progress, 
          status: status || state.currentJob.status,
          message: message !== undefined ? message : state.currentJob.message
        } 
      };
    }
    
    // Update job in history
    return {
      jobHistory: state.jobHistory.map(job => 
        job.id === id 
          ? { 
              ...job, 
              progress, 
              status: status || job.status,
              message: message !== undefined ? message : job.message
            } 
          : job
      )
    };
  }),
  
  addJobToHistory: (job) => set((state) => ({ 
    jobHistory: [job, ...state.jobHistory].slice(0, 10) // Keep only the 10 most recent jobs
  })),
  
  clearJobHistory: () => set({ jobHistory: [] })
}));

export default useAppStore;
