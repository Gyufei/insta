import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Withdraw } from './withdraw';
import { Claim } from './claim';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useState } from 'react';
import { CircleCheckBig } from 'lucide-react';

interface TabButtonProps {
  label: string;
  value: string;
  activeTab: string;
  onClick: () => void;
}

function TabButton({ label, value, activeTab, onClick }: TabButtonProps) {
  const isActive = activeTab === value;

  return (
    <div className="flex">
      <button
        className={`relative flex flex-1 cursor-pointer items-center gap-2 rounded-sm border bg-white px-4 py-3 outline-none select-none focus:outline-none ${
          isActive
            ? 'border-ocean-blue-pure dark:border-grey-light'
            : 'border-grey-light hover:border-ocean-blue-pure dark:border-grey-pure dark:hover:border-grey-light'
        } dark:bg-dark-400`}
        onClick={onClick}
      >
        <p className="text-sm leading-none font-semibold">{label}</p>
        {isActive && (
          <div
            className="bg-ocean-blue-pure dark:bg-grey-light dark:text-dark-600 absolute flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-white"
            style={{ top: '-6px', right: '-6px' }}
          >
            <CircleCheckBig className="h-3.5 w-3.5 dark:opacity-90" />
          </div>
        )}
      </button>
    </div>
  );
}

export function AprioriWithdraw() {
  const { setIsOpen } = useSideDrawerStore();
  const [activeTab, setActiveTab] = useState('withdraw');

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full py-0">
          <div
            className="mx-auto grid w-full grid-cols-2 gap-2 whitespace-nowrap"
            style={{ maxWidth: '296px' }}
          >
            <TabButton
              label="Request"
              value="withdraw"
              activeTab={activeTab}
              onClick={() => setActiveTab('withdraw')}
            />
            <TabButton
              label="Claim"
              value="claim"
              activeTab={activeTab}
              onClick={() => setActiveTab('claim')}
            />
          </div>
          <TabsContent value="withdraw" className="mt-2">
            <Withdraw />
          </TabsContent>
          <TabsContent value="claim" className="mt-2">
            <Claim />
          </TabsContent>
        </Tabs>
      </SideDrawerLayout>
    </>
  );
}
