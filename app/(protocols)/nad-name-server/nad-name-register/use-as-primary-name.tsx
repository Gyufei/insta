import { Info } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UseAsPrimaryNameProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function UseAsPrimaryName({ checked, onCheckedChange }: UseAsPrimaryNameProps) {
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="flex items-center gap-1">
        <span className="font-bold text-base">Use as primary name</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                This links your address to this name, allowing dApps to display it as your profile
                when connected to them. Only one primary name per address.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
