import { IToken } from '@/config/tokens';
import { truncateIfExceeds } from '@/lib/utils/number';

import { Card } from '@/components/ui/card';

export function WithdrawEstReceive({
  receiveToken,
  receiveAmount,
}: {
  receiveToken: IToken;
  receiveAmount: string;
}) {
  return (
    <>
      <Card className="relative flex-grow cursor-pointer rounded-[6px] border-[#EBEBEB] p-4 max-lg:w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-blue text-sm font-semibold">Use aPriori</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">Standard:</p>
              <p className="text-blue text-sm">1 : 1</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">Wait time:</p>
              <p className="text-blue text-sm">18 hours</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">You receive:</p>
              <p className="text-blue text-sm">
                {receiveAmount !== '0' ? truncateIfExceeds(receiveAmount || '0', 4) : '0'} {receiveToken.symbol}
              </p>
            </div>
          </div>
        </div>
      </Card>
      {/* <Card className="pointer-events-none relative mt-4 flex-grow rounded-[16px] border border-solid border-white/[.14] p-4 opacity-50 max-lg:w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-blue text-xs font-semibold">Use Pool</p>
            <p className="text-blue text-xs font-medium">Coming soon</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-300">Rate:</p>
              <p className="text-blue text-xs font-medium"></p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-300">Wait time:</p>
              <p className="text-blue text-xs font-medium"></p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-300">You receive:</p>
              <p className="text-blue text-xs font-medium"></p>
            </div>
          </div>
        </div>
      </Card> */}
    </>
  );
}
