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
    <Card className={cn('p-4 flex space-x-4', className)}>
      <TokenIcon symbol={token.symbol} src={token.iconSrc} />

      <div className="flex-1">
        <div className="flex justify-between">
          <div className="font-semibold">${token.value}</div>
          {token.hasPosition ? (
            <div className="px-2 py-0.5 bg-blue-100 text-primary rounded text-xs">Active</div>
          ) : (
            <div className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">No Position</div>
          )}
        </div>

        <div className="text-sm text-muted-foreground mt-0.5">
          {token.amount} {token.symbol}
        </div>

        <div className="grid grid-cols-2 mt-4 gap-1 text-sm">
          <div className="bg-gray-50 px-2 py-1 rounded text-center text-gray-500">C.F: 0</div>
          <div className="bg-gray-50 px-2 py-1 rounded text-center text-gray-500">L.L: 0</div>
        </div>

        <div className="grid grid-cols-2 mt-3 gap-4">
          <div>
            <div className="text-gray-dark text-center">0.00%</div>
            <div className="text-xs text-gray-500 text-center">Supply</div>
          </div>
          <div>
            <div className="text-gray-dark text-center">0.00%</div>
            <div className="text-xs text-gray-500 text-center">Borrow</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" size="sm" className="text-xs h-8">
            Supply
          </Button>
          <Link href={`/aave-v3-lido/borrow?tokenKey=${tokenKey}`} passHref>
            <Button variant="outline" size="sm" className="text-xs h-8 w-full">
              Borrow
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
