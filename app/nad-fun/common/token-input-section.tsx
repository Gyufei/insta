import { TokenInput } from '@/components/side-drawer/common/token-input';
import { SetInputBtn } from './set-input-btn';
import { formatNumber } from '@/lib/utils/number';
import { HrLine } from '@/components/hr-line';

interface TokenInputSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  balance: string;
  tokenSymbol: string;
  suffix: string;
  setInputButtons: {
    label: string;
    onClick: () => void;
  }[];
}

export function TokenInputSection({
  inputValue,
  onInputChange,
  balance,
  tokenSymbol,
  suffix,
  setInputButtons,
}: TokenInputSectionProps) {
  return (
    <>
      <TokenInput
        inputValue={inputValue}
        onInputChange={onInputChange}
        placeholder="0.00"
        suffix={suffix}
      />

      <div
        className="group text-grey-pure mt-2 cursor-pointer pl-1 text-xs"
        onClick={() => onInputChange(balance)}
      >
        <span className="font-semibold">
          {tokenSymbol} Balance:&nbsp;
          <span className="group-hover:text-black">{formatNumber(balance)}</span>
        </span>
      </div>
      <div className="text-grey-pure mt-2 flex gap-2">
        {setInputButtons.map((button, index) => (
          <SetInputBtn key={index} label={button.label} onClick={button.onClick} />
        ))}
      </div>
      <HrLine />
    </>
  );
} 