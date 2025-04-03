'use client';

import { Card } from '@/components/ui/card';
import TokenIcon from '@/components/token-icon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PositionCardProps {
  token: {
    symbol: string;
    name: string;
    iconSrc: string;
    amount: string;
    value: string;
    hasPosition: boolean;
  };
  className?: string;
}

export default function PositionCard({ token, className }: PositionCardProps) {
  const tokenKey = token.symbol.toLowerCase();

  return (
    <Card className={cn('flex space-x-4 p-4', className)}>
      <TokenIcon symbol={token.symbol} src={token.iconSrc} />

      <div className="flex-1">
        <div className="flex justify-between">
          <div className="font-semibold">${token.value}</div>
          {token.hasPosition ? (
            <div className="text-primary rounded bg-blue-100 px-2 py-0.5 text-xs">Active</div>
          ) : (
            <div className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">No Position</div>
          )}
        </div>

        <div className="text-muted-foreground mt-0.5 text-sm">
          {token.amount} {token.symbol}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 text-sm">
          <div className="rounded bg-gray-50 px-2 py-1 text-center text-gray-500">C.F: 0</div>
          <div className="rounded bg-gray-50 px-2 py-1 text-center text-gray-500">L.L: 0</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-dark text-center">0.00%</div>
            <div className="text-center text-xs text-gray-500">Supply</div>
          </div>
          <div>
            <div className="text-gray-dark text-center">0.00%</div>
            <div className="text-center text-xs text-gray-500">Borrow</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Supply
          </Button>
          <Link href={`/aave-v3-lido/borrow?tokenKey=${tokenKey}`} passHref>
            <Button variant="outline" size="sm" className="h-8 w-full text-xs">
              Borrow
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
