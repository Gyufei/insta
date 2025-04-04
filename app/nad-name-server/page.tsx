import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Search, Settings, Shield, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const domains = [
  {
    name: 'example.nad',
    status: 'Active',
    expiry: '2025-03-15',
    owner: '0x1234...5678',
    icon: '/icons/nad-name-server.svg',
  },
  {
    name: 'project.nad',
    status: 'Active',
    expiry: '2024-12-01',
    owner: '0x8765...4321',
    icon: '/icons/nad-name-server.svg',
  },
  {
    name: 'community.nad',
    status: 'Expiring Soon',
    expiry: '2024-06-30',
    owner: '0xabcd...efgh',
    icon: '/icons/nad-name-server.svg',
  },
];

const stats = [
  {
    value: '12,345',
    label: 'Registered Domains',
    icon: <Globe className="text-blue-accent h-6 w-6" />,
  },
  {
    value: '5,678',
    label: 'Active Users',
    icon: <Users className="text-green-accent h-6 w-6" />,
  },
  {
    value: '99.9%',
    label: 'Uptime',
    icon: <Shield className="text-purple-accent h-6 w-6" />,
  },
];

export default function NadNameServer() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Nad Name Server" src="/icons/nad-name-server.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 xxl:py-12 xxl:px-4">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-xxl font-semibold">Domain Management</h2>

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
              <h3 className="mb-4 text-xl font-medium">System Status</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Domain Resolution</div>
                  <div className="text-sm font-medium">98%</div>
                </div>
                <Progress value={98} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">All systems operational</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xxl font-semibold">Your Domains</h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-light text-primary h-9 hover:bg-blue-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search domains"
                    className="h-9 w-48 rounded-md border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {domains.map((domain, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <img src={domain.icon} alt={domain.name} className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{domain.name}</div>
                        <div className="text-muted-foreground text-xs">Owner: {domain.owner}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Status</div>
                        <div className={`font-medium ${domain.status === 'Active' ? 'text-green-500' : 'text-amber-500'}`}>
                          {domain.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Expiry</div>
                        <div className="font-medium">{domain.expiry}</div>
                      </div>
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Register New Domain
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 