import { Button } from '@/components/atoms/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';
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
  toastTitle = 'Copied to clipboard',
  toastDescription,
}: CopyButtonProps) {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue);
    toast.success({
      title: toastTitle,
      description: toastDescription,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
