import { Separator } from '@/components/ui/separator';

interface EstimatedReceiveProps {
  inputValue: string;
  receiveTokenSymbol: string;
}

export function EstimatedReceive({ inputValue, receiveTokenSymbol }: EstimatedReceiveProps) {
  return (
    <>
      <div className="mt-4 flex flex-shrink-0 flex-wrap items-center justify-between">
        <div className="mr-3 flex flex-col items-start">
          <div className="text-gray-300 mb-4 flex text-sm leading-none">
            <div className="flex">Estimated Receive</div>
          </div>
          <div className="text-blue h-6 text-xl leading-none font-medium">
            {inputValue || '0'} &nbsp;
            <span className="text-gray-300 text-xs">{receiveTokenSymbol}</span>
          </div>
        </div>
      </div>
      <Separator/>
    </>
  );
} 