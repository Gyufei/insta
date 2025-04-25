import { NumberInput } from '@/components/common/number-input';

interface TokenInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
}

export function TokenInput({
  inputValue,
  onInputChange,
  placeholder = 'Amount',
  suffix = '',
}: TokenInputProps) {
  return (
    <div className="mt-4 flex w-full flex-shrink-0 flex-col">
      <div className="relative flex">
        <NumberInput
          placeholder={placeholder}
          className="w-full pr-2 pl-4 bg-primary-foreground"
          value={inputValue}
          onChange={(v) => onInputChange(v)}
        />
        {suffix && (
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      <div className="h-0"></div>
    </div>
  );
}
