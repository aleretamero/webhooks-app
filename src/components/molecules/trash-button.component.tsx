import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/atoms/alert-dialog';
import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/molecules/tooltip.component';
import { useToast } from '@/hooks/use-toast.hook';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  tooltip?: string;
  toastTitle?: string;
  toastDescription?: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogActionText: string;
  dialogCancelText: string;
}

export function DeleteButton({
  onClick,
  title,
  dialogTitle,
  dialogDescription,
  dialogActionText,
  dialogCancelText,
  disabled,
  tooltip,
  toastTitle,
  toastDescription,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();

  const handleClick = () => {
    onClick();

    if (!toastTitle) return;

    toast.success({
      title: toastTitle,
      description: toastDescription,
    });
  };

  return (
    <>
      <Tooltip
        trigger={
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={disabled}
            className="disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {title}
          </Button>
        }
        tooltip={tooltip}
      />
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dialogCancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick}>
              {dialogActionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
