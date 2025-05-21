
import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import config from '@/config';

interface UseJobProgressProps {
  jobId?: string;
  onComplete?: (jobId: string) => void;
  onFail?: (jobId: string, error?: string) => void;
}

export const useJobProgress = ({ jobId, onComplete, onFail }: UseJobProgressProps = {}) => {
  const { currentJob, updateJobProgress } = useAppStore();
  
  useEffect(() => {
    if (!jobId) return;
    
    // Create EventSource for SSE connection
    const eventSource = new EventSource(`${config.api.baseUrl}${config.api.routes.progress}/${jobId}`);

    // Handle progress updates
    eventSource.addEventListener('progress', (event) => {
      try {
        const data = JSON.parse(event.data);
        updateJobProgress(jobId, data.progress, data.status, data.message);
        
        // Handle completion or failure
        if (data.status === 'completed' && onComplete) {
          onComplete(jobId);
        } else if (data.status === 'failed' && onFail) {
          onFail(jobId, data.message);
        }
        
        // Close connection on completion or failure
        if (data.status === 'completed' || data.status === 'failed') {
          eventSource.close();
        }
      } catch (error) {
        console.error('Error processing SSE event:', error);
      }
    });

    // Handle connection error
    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [jobId, onComplete, onFail, updateJobProgress]);

  return { progress: currentJob?.progress || 0, status: currentJob?.status || 'pending' };
};

export default useJobProgress;
