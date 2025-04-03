interface TokenInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder?: string;
}

export function TokenInput({ inputValue, onInputChange, placeholder = 'Amount' }: TokenInputProps) {
  return (
    <div className="mt-6 flex w-full flex-shrink-0 flex-col">
      <div className="relative flex">
        <input
          autoComplete="off"
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          className="form-input w-full pr-2 pl-4"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
        />
      </div>
      <div className="h-0"></div>
    </div>
  );
}
