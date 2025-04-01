import Header from '@/components/layout/page-header';
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

export default function Aave() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Aave v3 Lido" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 xxl:py-12">
        <div className="flex w-full max-w-container-main flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                value="$0.00"
                label="Lend"
                icon={<Banknote className="w-6 h-6 text-green-accent" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />

              <StatCard
                value="$0.00"
                label="Borrowed"
                icon={<Wallet className="w-6 h-6 text-purple-accent" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />

              <StatCard
                value="0.00%"
                label="net APY"
                tooltipText="Net Annual Percentage Yield"
                icon={<Percent className="w-6 h-6 text-primary" />}
                className="bg-gradient-to-br from-blue-50 to-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* D/C Ratio Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-2">
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
                  <div className="bg-gray-100 text-gray-500 px-3 py-1 text-xs rounded">No position</div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">D / C (%)</div>
                <div className="text-xs text-gray-500 mb-1">Max - 0.00%</div>
              </Card>

              {/* Liquidation Card */}
              <Card className="p-6">
                <div className="flex items-center mb-1">
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
                    className="ml-1 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">Liquidation (ETH)</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Positions</h2>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="h-9 border-primary bg-blue-light text-primary hover:bg-blue-100">
                  E-Mode
                </Button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input type="text" placeholder="Search position" className="pl-9 pr-4 py-2 h-9 w-48 text-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
