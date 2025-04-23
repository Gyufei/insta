import { IUniswapPosition } from '@/lib/data/use-uniswap-position';

interface PositionItemProps {
  position: IUniswapPosition;
}

export function PositionItem({ position }: PositionItemProps) {
  const { v3Position } = position;
  const { token0, token1, amount0, amount1, feeTier, currentPrice } = v3Position;

  return (
    <div className="flex flex-col rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
            <div className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">
              {token0.symbol} / {token1.symbol}
            </div>
            <div className="text-xs text-muted-foreground">{Number(feeTier) / 10000}%</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{position.status}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Token 0 Amount</div>
          <div className="text-sm font-medium">{amount0}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Token 1 Amount</div>
          <div className="text-sm font-medium">{amount1}</div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-xs text-muted-foreground">Current Price</div>
        <div className="text-sm font-medium">{currentPrice}</div>
      </div>
    </div>
  );
} 