import { InfoIcon } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { AuthorityAdd } from './authority-add';
import { AuthorityList } from './authority-list';

export function AuthorityManage() {
  return (
    <div className="mt-8 flex flex-col border-t border-[#ebebeb] pt-8">
      <div className="flex items-center text-center text-base font-medium">
        Authorities
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-[#A5ADC6] hover:text-blue dark:hover:text-primary-foreground ml-2 flex h-4 w-4 cursor-pointer items-center justify-center text-[9px] leading-none transition-colors duration-150">
                <InfoIcon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px]">
                Authorities are your trusted Ethereum addresses. Only they can request withdrawals
                from your account.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AuthorityAdd />
      <div className="mt-4 space-y-4">
        <AuthorityList />
      </div>
    </div>
  );
}
