import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast.hook';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  title?: string;
  tooltip?: string;
  toastTitle?: string;
  toastDescription?: string;
}

export function RefreshButton({
  onClick,
  title = 'Refresh',
  tooltip = 'Refresh',
  toastTitle,
  toastDescription,
}: RefreshButtonProps) {
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const handleRefresh = () => {
    setRefreshing(true);
    onClick();
    setTimeout(() => {
      setRefreshing(false);
      if (!toastTitle) return;
      toast.success({
        title: toastTitle,
        description: toastDescription,
      });
    }, 500);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw
              className={cn(`h-4 w-4 mr-2`, {
                'animate-spin': refreshing,
              })}
            />
            {title}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
