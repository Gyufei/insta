import { Switch } from '@/components/switch';
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
            className="mt-6 flex items-center justify-between cursor-pointer" 
            onClick={handleClick}
          >
            <div className="font-semibold">Set Max</div>
            <div>
              <Switch checked={checked} onChange={handleMaxSwitchChange} disabled={disabled} />
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
