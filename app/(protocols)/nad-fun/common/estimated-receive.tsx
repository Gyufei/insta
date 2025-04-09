import { HrLine } from '@/components/hr-line';

interface EstimatedReceiveProps {
  inputValue: string;
  receiveTokenSymbol: string;
}

export function EstimatedReceive({ inputValue, receiveTokenSymbol }: EstimatedReceiveProps) {
  return (
    <>
      <div className="mt-4 flex flex-shrink-0 flex-wrap items-center justify-between">
        <div className="mr-3 flex flex-col items-start">
          <div className="text-grey-pure mb-4 flex text-sm leading-none">
            <div className="flex">Estimated Receive</div>
          </div>
          <div className="text-ocean-blue-pure h-6 text-xl leading-none font-medium">
            {inputValue || '0'} &nbsp;
            <span className="text-grey-pure text-xs">{receiveTokenSymbol}</span>
          </div>
        </div>
      </div>
      <HrLine />
    </>
  );
} 