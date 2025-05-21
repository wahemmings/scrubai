
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "@/components/ui/sonner";
import config from "@/config";

// Define credit costs for different operations
export const CREDIT_COSTS = {
  text: 1,
  document: 2,
  image: 3,
};

interface ProcessingOptions {
  type: 'text' | 'document' | 'image';
  content: string | File;
  options: Record<string, any>;
}

export const processContent = async ({
  type,
  content,
  options,
}: ProcessingOptions) => {
  try {
    // Get required credits for the operation
    const requiredCredits = CREDIT_COSTS[type];
    
    // Check if user has enough credits
    const { data: creditData, error: creditError } = await supabase
      .from('credits')
      .select('amount')
      .maybeSingle();
    
    if (creditError) {
      throw new Error(`Failed to check credits: ${creditError.message}`);
    }
    
    if (!creditData || creditData.amount < requiredCredits) {
      throw new Error(`Insufficient credits. You need ${requiredCredits} credits for this operation.`);
    }
    
    // Create a job record
    const fileName = content instanceof File ? content.name : 'text-content.txt';
    const fileSize = content instanceof File ? content.size : content.length;
    
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .insert({
        id: crypto.randomUUID(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
        job_type: type,
        status: 'processing',
        file_name: fileName,
        file_size: fileSize,
        progress: 0,
      })
      .select()
      .single();
    
    if (jobError) {
      throw new Error(`Failed to create job: ${jobError.message}`);
    }
    
    // Update local state with the new job
    useAppStore.getState().setCurrentJob({
      id: jobData.id,
      progress: 0,
      status: 'processing',
    });
    
    // Process content (simulation for now)
    // In a real app, you would send this to a backend service
    // For demo purposes, we'll simulate processing with setTimeout
    await simulateProcessing(jobData.id);
    
    // Deduct credits after successful processing
    const { error: deductError } = await supabase
      .from('credits')
      .update({ amount: creditData.amount - requiredCredits })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (deductError) {
      console.error('Failed to deduct credits:', deductError);
      // We still consider the job successful even if credit deduction fails
    }
    
    // Update user's credits in the app store
    useAppStore.getState().setCredits(creditData.amount - requiredCredits);
    
    // Add the job to history
    useAppStore.getState().addJobToHistory({
      id: jobData.id,
      progress: 100,
      status: 'completed',
      message: 'Processing completed successfully',
    });
    
    // Return processed content (simulated in this case)
    return {
      success: true,
      jobId: jobData.id,
      message: 'Content processed successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error('Processing failed', {
      description: errorMessage,
    });
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Simulate processing with progress updates
const simulateProcessing = async (jobId: string): Promise<void> => {
  const totalSteps = 10;
  for (let step = 1; step <= totalSteps; step++) {
    const progress = Math.floor((step / totalSteps) * 100);
    
    // Update progress in database
    await supabase
      .from('jobs')
      .update({ progress, status: step === totalSteps ? 'completed' : 'processing' })
      .eq('id', jobId);
    
    // Update progress in local state
    useAppStore.getState().updateJobProgress(
      jobId, 
      progress, 
      step === totalSteps ? 'completed' : 'processing'
    );
    
    // Wait a bit before the next update (simulating processing time)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};
