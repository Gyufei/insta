import { Input } from '@/components/ui/input';

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
        <Input
          autoComplete="off"
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          className="w-full pr-2 pl-4 bg-white"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
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
