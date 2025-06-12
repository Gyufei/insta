import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export function SetMax({
  disabled = false,
  tooltip = '',
  onChange = () => {},
  checked = false,
}: {
  disabled?: boolean;
  tooltip?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  function handleClick() {
    if (disabled) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
  }

  function handleMaxSwitchChange(checked: boolean) {
    onChange(checked);
  }

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <div
            className="px-1 py-4 rounded-sm flex cursor-pointer items-center justify-between"
            onClick={handleClick}
          >
            <div className="font-semibold text-xs">Set Max</div>
            <div>
              <Switch checked={checked} onCheckedChange={handleMaxSwitchChange} disabled={disabled} />
            </div>
          </div>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent className="w-[160px]">
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
