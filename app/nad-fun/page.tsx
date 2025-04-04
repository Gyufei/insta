import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Users, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    value: '$1,234,567',
    label: 'Total Value Locked',
    icon: <Wallet className="text-blue-accent h-6 w-6" />,
    change: '+12.5%',
    isPositive: true,
  },
  {
    value: '12,345',
    label: 'Active Users',
    icon: <Users className="text-green-accent h-6 w-6" />,
    change: '+8.3%',
    isPositive: true,
  },
  {
    value: '$89,123',
    label: '24h Volume',
    icon: <BarChart className="text-purple-accent h-6 w-6" />,
    change: '-2.1%',
    isPositive: false,
  },
];

const features = [
  {
    title: 'NFT Marketplace',
    description: 'Buy, sell, and trade NFTs with low fees and high liquidity',
    icon: '/icons/nft.svg',
  },
  {
    title: 'Staking',
    description: 'Stake your tokens to earn rewards and participate in governance',
    icon: '/icons/staking.svg',
  },
  {
    title: 'DeFi Integration',
    description: 'Access DeFi protocols and services directly from Nad.Fun',
    icon: '/icons/defi.svg',
  },
];

export default function NadFun() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Nad.Fun" src="/icons/nad-fun.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold">Overview</h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {stat.icon}
                      <div className="font-medium">{stat.value}</div>
                    </div>
                    <div className={`flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.isPositive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="ml-1 text-sm">{stat.change}</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </Card>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-medium">Platform Growth</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">User Adoption</div>
                  <div className="text-sm font-medium">75%</div>
                </div>
                <Progress value={75} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">Target: 100,000 users</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Features</h2>
              <Button variant="outline" size="sm" className="border-primary bg-blue-light text-primary h-9 hover:bg-blue-100">
                Explore All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <img src={feature.icon} alt={feature.title} className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                  <Button variant="ghost" className="mt-4 p-0 text-primary hover:bg-transparent">
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 