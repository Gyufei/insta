import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Coins, Heart, MessageCircle, Search, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const memeTokens = [
  {
    name: 'DOGE',
    price: '$0.12',
    change24h: '+15.3%',
    marketCap: '$16.2B',
    volume24h: '$1.2B',
    icon: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  {
    name: 'PEPE',
    price: '$0.00000123',
    change24h: '+8.7%',
    marketCap: '$420M',
    volume24h: '$69M',
    icon: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
  {
    name: 'WOJAK',
    price: '$0.00456',
    change24h: '-5.2%',
    marketCap: '$123M',
    volume24h: '$12.3M',
    icon: 'https://ext.same-assets.com/3833913722/2521633714.svg',
  },
];

const communityPosts = [
  {
    title: 'New meme token launching soon!',
    author: 'CryptoWhale',
    likes: 1234,
    comments: 89,
    time: '2h ago',
    icon: '/icons/monad.svg',
  },
  {
    title: 'Which meme token will moon next?',
    author: 'DiamondHands',
    likes: 567,
    comments: 234,
    time: '5h ago',
    icon: '/icons/monad.svg',
  },
  {
    title: 'My meme token investment strategy',
    author: 'MoonBoy',
    likes: 890,
    comments: 123,
    time: '1d ago',
    icon: '/icons/monad.svg',
  },
];

const stats = [
  {
    value: '$42.1B',
    label: 'Total Market Cap',
    icon: <Coins className="text-blue-accent h-6 w-6" />,
  },
  {
    value: '$3.2B',
    label: '24h Volume',
    icon: <TrendingUp className="text-green-accent h-6 w-6" />,
  },
  {
    value: '1,234',
    label: 'Active Tokens',
    icon: <BarChart className="text-purple-accent h-6 w-6" />,
  },
];

export default function Meme() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Meme" src="/icons/monad.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12 2xl:px-4">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-xxl font-semibold">Meme Token Market</h2>

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
              <h3 className="mb-4 text-xl font-medium">Market Sentiment</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Bullish</div>
                  <div className="text-sm font-medium">75%</div>
                </div>
                <Progress value={75} className="h-2" />
                <div className="mt-2 text-xs text-gray-300-500">Based on social media sentiment</div>
              </Card>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xxl font-semibold">Top Meme Tokens</h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-200 text-primary h-9 hover:bg-blue-100"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Sort
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-300-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search tokens"
                    className="h-9 w-48 rounded-md border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {memeTokens.map((token, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <img src={token.icon} alt={token.name} className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-muted-foreground text-xs">Price: {token.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">24h Change</div>
                        <div className={`font-medium ${token.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {token.change24h}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Market Cap</div>
                        <div className="font-medium">{token.marketCap}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">24h Volume</div>
                        <div className="font-medium">{token.volume24h}</div>
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

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xxl font-semibold">Community</h2>
              <Button
                variant="outline"
                size="sm"
                className="border-primary bg-blue-200 text-primary h-9 hover:bg-blue-100"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {communityPosts.map((post, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <img src={post.icon} alt={post.author} className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {post.author} • {post.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{post.comments}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-blue-500/50">
                        View
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