
import { genId, dispatch } from "./toast-store";
import { Toast, ToastOptions, ToasterToast } from "./toast-types";

// Base toast function
export function toast(props: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
        props.onOpenChange?.(open);
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Helper functions with improved typings
toast.success = (title: string, options: ToastOptions = {}) => {
  return toast({ title, ...options, type: "success" });
};

toast.error = (title: string, options: ToastOptions = {}) => {
  return toast({ title, ...options, type: "error", variant: "destructive" });
};

toast.warning = (title: string, options: ToastOptions = {}) => {
  return toast({ title, ...options, type: "warning" });
};
