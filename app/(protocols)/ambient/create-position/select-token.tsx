import { CreatePoolTip } from '@/app/(protocols)/uniswap/create-position/create-pool-tip';
import { PairTokenDisplay } from '@/app/(protocols)/uniswap/create-position/pair-token-display';
import { PairTokenSelected } from '@/app/(protocols)/uniswap/uni-common/use-token-selector';

import { IToken } from '@/lib/data/tokens';

export function SelectToken({
  token0,
  token1,
  setShowTokenSelector,
  isNewPool,
}: {
  token0?: IToken;
  token1?: IToken;
  setShowTokenSelector: (token: PairTokenSelected) => void;
  isNewPool: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 px-[1px]">
      <div className="flex flex-col px-[1px]">
        <div className="text-lg font-medium text-primary">Select pair</div>
        <div className="text-xs text-gray-400">
          Choose the tokens you want to provide liquidity for.{' '}
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <PairTokenDisplay
            token={token0}
            onClick={() => setShowTokenSelector(PairTokenSelected.Token0)}
          />
          <PairTokenDisplay
            token={token1}
            onClick={() => setShowTokenSelector(PairTokenSelected.Token1)}
          />
        </div>
      </div>

      {isNewPool && <CreatePoolTip />}
    </div>
  );
}
