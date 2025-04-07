import { IToken } from '@/lib/data/tokens';
import { Card } from '@/components/ui/card';

export function EstReceive({
  receiveToken,
  receiveAmount,
}: {
  receiveToken: IToken;
  receiveAmount: string;
}) {
  return (
    <>
      <Card className="relative mt-4 flex-grow cursor-pointer rounded-[16px] border border-solid border-white/[.14] p-4 max-lg:w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-ocean-blue-pure text-xs font-semibold">Use aPriori</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">Rate:</p>
              <p className="text-ocean-blue-pure text-xs font-medium">1 : 1</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">Wait time:</p>
              <p className="text-ocean-blue-pure text-xs font-medium">10 minutes</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">You receive:</p>
              <p className="text-ocean-blue-pure text-xs font-medium">
                {receiveAmount} {receiveToken.symbol}
              </p>
            </div>
          </div>
        </div>
        <div className="border-ocean-blue-pure pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-[2px] border-solid opacity-100 transition-opacity duration-300"></div>
      </Card>
      <Card className="pointer-events-none relative mt-4 flex-grow rounded-[16px] border border-solid border-white/[.14] p-4 opacity-50 max-lg:w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-ocean-blue-pure text-xs font-semibold">Use Pool</p>
            <p className="text-ocean-blue-pure text-xs font-medium">Coming soon</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">Rate:</p>
              <p className="text-ocean-blue-pure text-xs font-medium"></p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">Wait time:</p>
              <p className="text-ocean-blue-pure text-xs font-medium"></p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-grey-pure text-xs font-medium">You receive:</p>
              <p className="text-ocean-blue-pure text-xs font-medium"></p>
            </div>
          </div>
        </div>
        <div className="border-primarypurple pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-[2px] border-solid opacity-0 transition-opacity duration-300"></div>
      </Card>
    </>
  );
}
