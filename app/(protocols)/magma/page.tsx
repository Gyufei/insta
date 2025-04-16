import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Coins, Flame, Search, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const miningPools = [
  {
    name: 'ETH Mining Pool',
    hashRate: '1.2 TH/s',
    miners: '1,234',
    reward: '0.05 ETH',
    difficulty: '12.5T',
    icon: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  {
    name: 'BTC Mining Pool',
    hashRate: '85 PH/s',
    miners: '567',
    reward: '0.0005 BTC',
    difficulty: '35.2T',
    icon: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  {
    name: 'MAGMA Token Pool',
    hashRate: '450 GH/s',
    miners: '890',
    reward: '12.5 MAGMA',
    difficulty: '8.7T',
    icon: '/icons/magma.jpg',
  },
];

const stats = [
  {
    value: '2.5 EH/s',
    label: 'Total Hashrate',
    icon: <Zap className="text-blue-accent h-6 w-6" />,
  },
  {
    value: '2,691',
    label: 'Active Miners',
    icon: <Flame className="text-orange-accent h-6 w-6" />,
  },
  {
    value: '$1.2M',
    label: '24h Rewards',
    icon: <Coins className="text-yellow-accent h-6 w-6" />,
  },
];

export default function Magma() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Magma" src="/icons/magma.jpg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12 2xl:px-4">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-xxl font-semibold">Mining Dashboard</h2>

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
              <h3 className="mb-4 text-xl font-medium">Network Status</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Network Health</div>
                  <div className="text-sm font-medium">92%</div>
                </div>
                <Progress value={92} className="h-2" />
                <div className="mt-2 text-xs text-gray-300-500">Optimal performance</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xxl font-semibold">Mining Pools</h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-200 text-primary h-9 hover:bg-blue-100"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Statistics
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-300-400"
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
              {miningPools.map((pool, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <img src={pool.icon} alt={pool.name} className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{pool.name}</div>
                        <div className="text-muted-foreground text-xs">Hashrate: {pool.hashRate}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Miners</div>
                        <div className="font-medium">{pool.miners}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Reward</div>
                        <div className="font-medium text-green-500">{pool.reward}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Difficulty</div>
                        <div className="font-medium">{pool.difficulty}</div>
                      </div>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Join Pool
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 