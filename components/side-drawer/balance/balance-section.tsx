import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BalanceSectionProps {
  balance: string;
}

export default function BalanceSection({ balance }: BalanceSectionProps) {
  return (
    <div className="mt-6 mb-2 flex w-full flex-shrink-0 flex-col items-center px-8 text-center sm:mb-10">
      <h3 className="flex items-center leading-none">
        Balance
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-9 text-grey-pure hover:text-ocean-blue-pure dark:hover:text-light ml-1 flex h-4 w-4 cursor-pointer items-center justify-center leading-none transition-colors duration-150">
                <HelpCircle className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your current account balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      <div className="mt-4 text-[32px] font-semibold">${balance}</div>
    </div>
  );
}
