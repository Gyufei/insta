'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { IToken } from '@/lib/data/tokens';

export default function TokenInput({
  label,
  token,
  value,
  onChange,
  placeholder,
  showMaxButton = true,
}: {
  label: string;
  token: IToken | undefined;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  showMaxButton?: boolean;
}) {
  function handleInput(val: string) {
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-stretch flex-col pb-1 border rounded-2xl bg-accent p-4 focus-within:bg-white">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <Input
              placeholder={placeholder}
              className="!text-2xl !h-10 px-0 leading-10 border-none shadow-none focus-visible:ring-0"
              value={value}
              onChange={(e) => handleInput(e.target.value)}
            />
          </div>
          {token && <div>{token.symbol}</div>}
        </div>
        <div className="flex justify-end items-center gap-1">
          <span className="text-xs text-gray-400">0.000232</span>
          {showMaxButton && (
            <Button variant="outline" size="sm" className="h-5 px-1 text-xs">
              Max
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
