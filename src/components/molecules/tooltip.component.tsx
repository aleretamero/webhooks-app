import {
  Tooltip as DefaultTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';

interface TooltipProps {
  trigger: React.ReactNode;
  tooltip?: string;
}

export function Tooltip({ trigger, tooltip }: TooltipProps) {
  return (
    <TooltipProvider>
      <DefaultTooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </DefaultTooltip>
    </TooltipProvider>
  );
}
