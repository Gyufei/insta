import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AuthorityAdd } from './authority-add';
import { AuthorityList } from './authority-list';

export function AuthorityManage() {
  return (
    <div className="mt-10 flex flex-col">
      <div className="flex items-center justify-center text-center text-xl font-semibold">
        Authorities
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-gray-300 hover:text-blue dark:hover:text-primary-foreground ml-2 flex h-4 w-4 cursor-pointer items-center justify-center text-[9px] leading-none transition-colors duration-150">
                <InfoIcon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px]">
                Authorities are the Ethereum addresses that can access your DSA. Currently only
                Authorities are able to request withdrawals from the DSA.
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
