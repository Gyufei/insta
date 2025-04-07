import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Cloud, Search, Thermometer, Wind } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const sensors = [
  {
    name: 'Temperature Sensor',
    location: 'Main Server Room',
    status: 'Active',
    value: '22.5°C',
    threshold: '30°C',
    icon: <Thermometer className="text-red-accent h-6 w-6" />,
  },
  {
    name: 'Humidity Sensor',
    location: 'Data Center A',
    status: 'Active',
    value: '45%',
    threshold: '60%',
    icon: <Cloud className="text-blue-accent h-6 w-6" />,
  },
  {
    name: 'Air Flow Sensor',
    location: 'Cooling System',
    status: 'Warning',
    value: '2.1 m/s',
    threshold: '2.5 m/s',
    icon: <Wind className="text-amber-accent h-6 w-6" />,
  },
];

const stats = [
  {
    value: '98.5%',
    label: 'System Uptime',
    icon: <BarChart className="text-green-accent h-6 w-6" />,
  },
  {
    value: '12',
    label: 'Active Sensors',
    icon: <Thermometer className="text-blue-accent h-6 w-6" />,
  },
  {
    value: '0',
    label: 'Critical Alerts',
    icon: <Cloud className="text-purple-accent h-6 w-6" />,
  },
];

export default function Ambient() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Ambient" src="/icons/ambient.svg" />
      <div className="scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6 2xl:py-12 2xl:px-4">
        <div className="max-w-container-main flex w-full flex-col">
          <div className="mb-8">
            <h2 className="mb-6 text-xxl font-semibold">Environment Monitoring</h2>

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
              <h3 className="mb-4 text-xl font-medium">System Health</h3>
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">Overall Health</div>
                  <div className="text-sm font-medium">92%</div>
                </div>
                <Progress value={92} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">All systems operational</div>
              </Card>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xxl font-semibold">Active Sensors</h2>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-blue-light text-primary h-9 hover:bg-blue-100"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>

                <div className="relative">
                  <Search
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search sensors"
                    className="h-9 w-48 rounded-md border border-gray-200 py-2 pr-4 pl-9 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sensors.map((sensor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        {sensor.icon}
                      </div>
                      <div>
                        <div className="font-medium">{sensor.name}</div>
                        <div className="text-muted-foreground text-xs">Location: {sensor.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Status</div>
                        <div className={`font-medium ${sensor.status === 'Active' ? 'text-green-500' : 'text-amber-500'}`}>
                          {sensor.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Current Value</div>
                        <div className="font-medium">{sensor.value}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Threshold</div>
                        <div className="font-medium">{sensor.threshold}</div>
                      </div>
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        Details
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