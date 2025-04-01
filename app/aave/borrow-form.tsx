'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import TokenIcon from '@/components/token-icon';

const TOKEN_DATA = {
  usdc: {
    symbol: 'USDC',
    name: 'USD Coin',
    iconSrc: 'https://ext.same-assets.com/3833913722/2209159731.svg',
  },
  eth: {
    symbol: 'ETH',
    name: 'Ethereum',
    iconSrc: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  wsteth: {
    symbol: 'wstETH',
    name: 'Wrapped Staked Ethereum',
    iconSrc: 'https://ext.same-assets.com/3833913722/2968622260.svg',
  },
  usds: {
    symbol: 'USDS',
    name: 'USD Stable',
    iconSrc: 'https://ext.same-assets.com/3833913722/3007930394.svg',
  },
};

export default function BorrowFormSection() {
  const searchParams = useSearchParams();
  const tokenKey = searchParams.get('tokenKey') || 'usdc';
  const token = TOKEN_DATA[tokenKey as keyof typeof TOKEN_DATA] || TOKEN_DATA.usdc;
  const [aprType, setAprType] = useState("variable");
  const [amount, setAmount] = useState("");

  return (
    <>
      <div className="my-6">
        <Link href="/aave-v3-lido" className="flex items-center text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
          <span>Borrow {token.symbol}</span>
        </Link>
      </div>

      <div className="absolute right-6 top-24 w-80 p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-2">
              <TokenIcon symbol={token.symbol} src={token.iconSrc} size="sm" />
              <h2 className="text-lg font-semibold">Borrow {token.symbol}</h2>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-sm font-medium">APR type</div>
            <RadioGroup value={aprType} onValueChange={setAprType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="variable" id="apr-variable" />
                <label
                  htmlFor="apr-variable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Variable
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stable" id="apr-stable" />
                <label
                  htmlFor="apr-stable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Stable (0.00%)
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <div className="mb-2 text-sm font-medium">Borrowed</div>
            <div className="text-xl">0</div>
          </div>

          <Card className="p-4 mb-6">
            <div className="text-sm mb-2">Amount to borrow</div>
            <Input type="text" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
          </Card>

          <div className="mb-6">
            <div className="text-lg font-medium mb-4">Projected Debt Position</div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                <div className="text-sm">Status</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">No position</div>
            </div>

            <div className="text-xs text-gray-500 mb-2">Max: L.L. 0.00%</div>

            <Progress value={0} className="h-2 mb-4" />

            <div className="text-center text-lg mb-6">0.00%</div>

            <div>
              <div className="text-sm mb-2">Liquidation Price (ETH)</div>
              <div className="text-lg">$0.00 / $0.00</div>
            </div>
          </div>

          <Button className="w-full" disabled>
            Borrow
          </Button>
        </div>
      </div>
    </>
  );
}
