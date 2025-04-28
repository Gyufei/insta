import { IToken } from '@/lib/data/tokens';

import { PairTokenSelected } from '../common/use-token-selector';
import { CreatePoolTip } from './create-pool-tip';
import FeeTierSelector from './fee-tier-selector';
import { PairTokenDisplay } from './pair-token-display';

export function SelectTokenAndFeeTier({
  token0,
  token1,
  setShowTokenSelector,
  setFeeTier,
  feeTier,
  isNewPool,
}: {
  token0?: IToken;
  token1?: IToken;
  setShowTokenSelector: (token: PairTokenSelected) => void;
  setFeeTier: (tier: string) => void;
  feeTier: string;
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

      <FeeTierSelector selectedTier={feeTier} onChange={(tier) => setFeeTier(tier)} />

      {isNewPool && <CreatePoolTip />}
    </div>
  );
}
