import { Button } from '@/components/atoms/button';
import { Tooltip } from '@/components/molecules/tooltip.component';
import { useToast } from '@/hooks/use-toast.hook';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyValue: any;
  title?: string;
  tooltip?: string;
  toastTitle?: string;
  toastDescription?: string;
}

export function CopyButton({
  copyValue,
  tooltip = 'Copy to clipboard',
  toastTitle,
  toastDescription,
}: CopyButtonProps) {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue);

    if (!toastTitle) return;
    toast.success({
      title: toastTitle,
      description: toastDescription,
    });
  };

  return (
    <Tooltip
      trigger={
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      }
      tooltip={tooltip}
    />
  );
}
