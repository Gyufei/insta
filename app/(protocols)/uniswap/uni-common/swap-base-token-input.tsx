import { useMemo } from 'react';

import { NumberInput } from '@/components/common/number-input';

import { cn } from '@/lib/utils';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  isExceedBalance?: boolean;
}

const INPUT_SIZE_CLASSES = {
  sm: 'md:text-sm',
  md: 'md:text-base',
  lg: 'md:text-lg',
  xl: 'md:text-xl',
  '2xl': 'md:text-2xl',
};

const getInputSizeClass = (value: string) => {
  if (value.length <= 6) return INPUT_SIZE_CLASSES['2xl'];
  if (value.length <= 8) return INPUT_SIZE_CLASSES.xl;
  if (value.length <= 10) return INPUT_SIZE_CLASSES.lg;
  if (value.length <= 15) return INPUT_SIZE_CLASSES.md;
  return INPUT_SIZE_CLASSES.sm;
};

export const SwapBaseTokenInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  isExceedBalance,
}: TokenInputProps) => {
  const inputSizeClass = useMemo(() => getInputSizeClass(value), [value]);

  return (
    <NumberInput
      placeholder={placeholder}
      className={cn(
        inputSizeClass,
        'text-primary disabled:opacity-100 !h-10 px-0 leading-10 border-none shadow-none dark:bg-transparent !bg-transparent focus-visible:ring-0',
        isExceedBalance && 'text-red-500'
      )}
      value={value}
      onChange={(v) => onChange(v)}
      disabled={disabled}
    />
  );
};
