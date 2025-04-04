import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, BarChart, Coins, Search, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const pools = [
  {
    name: 'ETH/USDC',
    tvl: '$12,345,678',
    volume24h: '$1,234,567',
    apy: '12.5%',
    curve: 'Stable',
    icon1: 'https://ext.same-assets.com/3833913722/2521633714.svg',
    icon2: 'https://ext.same-assets.com/3833913722/2209159731.svg',
  },
  {
    name: 'WBTC/ETH',
    tvl: '$8,765,432',
    volume24h: '$987,654',
    apy: '8.3%',
    curve: 'Volatile',
    icon1: 'https://ext.same-assets.com/3833913722/2521633714.svg',
    icon2: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  {
    name: 'USDC/USDT',
    tvl: '$5,432,109',
    volume24h: '$543,210',
    apy: '5.2%',
    curve: 'Stable',
    icon1: 'https://ext.same-assets.com/3833913722/2209159731.svg',
    icon2: 'https://ext.same-assets.com/3833913722/2209159731.svg',
  },
];

const stats = [
  {
    value: '$1.2B',
    label: 'Total Value Locked',
    icon: <Coins className="text-blue-accent h-6 w-6" />,
  },
  {
    value: '$123.4M',
    label: '24h Volume',
    icon: <TrendingUp className="text-green-accent h-6 w-6" />,
  },
  {
    value: '1,234',
    label: 'Active Pools',
    icon: <BarChart className="text-purple-accent h-6 w-6" />,
  },
];

export default function Curvance() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Curvance" src="/icons/curvance.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold">Curve Trading</h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="mb-2 flex items-center space-x-2">
                    {stat.icon}
                    <div className="font-medium">{stat.value}</div>
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </Card>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-medium">Protocol Health</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Liquidity Utilization</div>
                  <div className="text-sm font-medium">78%</div>
                </div>
                <Progress value={78} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">Target: 85% utilization</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Curve Pools</h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-light text-primary h-9 hover:bg-blue-100"
                >
                  <ArrowDownUp className="mr-2 h-4 w-4" />
                  Sort
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search pools"
                    className="h-9 w-48 rounded-md border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pools.map((pool, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex">
                        <img src={pool.icon1} alt={pool.name.split('/')[0]} className="h-8 w-8 rounded-full" />
                        <img
                          src={pool.icon2}
                          alt={pool.name.split('/')[1]}
                          className="absolute left-5 h-8 w-8 rounded-full border-2 border-white"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{pool.name}</div>
                        <div className="text-muted-foreground text-xs">TVL: {pool.tvl}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">24h Volume</div>
                        <div className="font-medium">{pool.volume24h}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">APY</div>
                        <div className="font-medium text-green-500">{pool.apy}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Curve Type</div>
                        <div className={`font-medium ${pool.curve === 'Stable' ? 'text-blue-500' : 'text-amber-500'}`}>
                          {pool.curve}
                        </div>
                      </div>
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        Trade
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold">Curve Analytics</h2>
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-medium">ETH/USDC Curve</h3>
                <div className="h-64 w-full rounded-md bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500">Curve visualization would appear here</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="text-muted-foreground text-sm">Price Impact</div>
                  <div className="font-medium">0.05%</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Slippage</div>
                  <div className="font-medium">0.02%</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Gas Cost</div>
                  <div className="font-medium">~$12.50</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 