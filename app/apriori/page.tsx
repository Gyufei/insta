import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, Wallet, Percent, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PositionCard from './position-card';
import StatCard from './stat-card';

const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    iconSrc: 'https://ext.same-assets.com/3833913722/2521633714.svg',
    amount: '0.00',
    value: '0.00',
    hasPosition: false,
  },
  {
    symbol: 'wstETH',
    name: 'Wrapped Staked Ethereum',
    iconSrc: 'https://ext.same-assets.com/3833913722/2968622260.svg',
    amount: '0.00',
    value: '0.00',
    hasPosition: false,
  },
  {
    symbol: 'USDS',
    name: 'USD Stable',
    iconSrc: 'https://ext.same-assets.com/3833913722/3007930394.svg',
    amount: '0.00',
    value: '0.00',
    hasPosition: false,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    iconSrc: 'https://ext.same-assets.com/3833913722/2209159731.svg',
    amount: '0.00',
    value: '0.00',
    hasPosition: false,
  },
];

export default function Apriori() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Apriori" src="/icons/apriori.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold">Overview</h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                value="$0.00"
                label="Lend"
                icon={<Banknote className="text-green-accent h-6 w-6" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />

              <StatCard
                value="$0.00"
                label="Borrowed"
                icon={<Wallet className="text-purple-accent h-6 w-6" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />

              <StatCard
                value="0.00%"
                label="net APY"
                tooltipText="Net Annual Percentage Yield"
                icon={<Percent className="text-primary h-6 w-6" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* D/C Ratio Card */}
              <Card className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="font-medium">0.00%</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                  <div className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-500">
                    No position
                  </div>
                </div>
                <div className="text-muted-foreground mb-4 text-sm">D / C (%)</div>
                <div className="mb-1 text-xs text-gray-500">Max - 0.00%</div>
              </Card>

              {/* Liquidation Card */}
              <Card className="p-6">
                <div className="mb-1 flex items-center">
                  <div className="font-medium">$0.00 / $0.00</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground ml-1"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <div className="text-muted-foreground text-sm">Liquidation (ETH)</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Positions</h2>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-light text-primary h-9 hover:bg-blue-100"
                >
                  E-Mode
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search position"
                    className="h-9 w-48 py-2 pr-4 pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tokens.map((token) => (
                <PositionCard key={token.symbol} token={token} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
