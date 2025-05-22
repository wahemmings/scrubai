
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const feedbackSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"]).optional(),
  feedback: z.string().min(5, "Please provide more details").max(500, "Feedback is too long"),
  includeLogs: z.boolean().default(false),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: undefined,
      feedback: "",
      includeLogs: false,
    },
  });
  
  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      // In a real app, send this data to your backend or analytics service
      console.log("Feedback submitted:", {
        ...data,
        pageUrl: location.pathname,
        timestamp: new Date().toISOString(),
      });
      
      toast.success("Thank you for your feedback!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // Toggle feedback widget when Shift+F is pressed
    if (e.shiftKey && e.key === "F") {
      e.preventDefault();
      setOpen(true);
    }
  };
  
  // Add keyboard shortcut listener
  useState(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  
  const ratingOptions = [
    { value: "1", label: "😞" },
    { value: "2", label: "🙁" },
    { value: "3", label: "😐" },
    { value: "4", label: "🙂" },
    { value: "5", label: "😄" },
  ];
  
  const feedbackForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormLabel>How would you rate your experience?</FormLabel>
          <div className="flex justify-between mt-2">
            {ratingOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={form.watch("rating") === option.value ? "default" : "outline"}
                className="w-12 h-12 text-xl"
                onClick={() => form.setValue("rating", option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's on your mind?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience, report a bug, or suggest an improvement..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="includeLogs"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Include diagnostic logs
                </FormLabel>
                <FormDescription>
                  This helps us troubleshoot any issues you're experiencing
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Submit feedback</Button>
        </div>
      </form>
    </Form>
  );
  
  return (
    <>
      {/* Floating feedback button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Provide feedback"
      >
        <MessageCircle size={18} />
        {!isMobile && <span>Feedback</span>}
      </button>
      
      {/* Feedback form - Dialog for desktop, Sheet for mobile */}
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Share your feedback</SheetTitle>
              <SheetDescription>
                Your feedback helps us improve ScrubAI. Thanks for sharing!
              </SheetDescription>
            </SheetHeader>
            {feedbackForm}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share your feedback</DialogTitle>
              <DialogDescription>
                Your feedback helps us improve ScrubAI. Thanks for sharing!
              </DialogDescription>
            </DialogHeader>
            {feedbackForm}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FeedbackWidget;
