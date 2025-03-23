import { toast } from 'sonner';

type ToastOptions = {
  title: string;
  description?: string;
  placement?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
};

interface ToastType {
  success: (options: ToastOptions) => void;
  error: (options: ToastOptions) => void;
  warning: (options: ToastOptions) => void;
  info: (options: ToastOptions) => void;
}

export function useToast(): ToastType {
  function createToast(type: 'success' | 'error' | 'warning' | 'info') {
    return (options: ToastOptions) => {
      toast[type](options.title, {
        position: options.placement,
        description: options.description,
      });
    };
  }

  return {
    success: createToast('success'),
    error: createToast('error'),
    warning: createToast('warning'),
    info: createToast('info'),
  };
}
