import { useState } from 'react';

import { ButtonWithCheck } from '@/components/common/button-with-check';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

import { Claim } from './claim';
import { Withdraw } from './withdraw';

export function AprioriWithdraw() {
  const [activeTab, setActiveTab] = useState('withdraw');

  const { handleBack } = useUrlPathDrawerChange('/apriori');

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={handleBack} />
      <SideDrawerLayout>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full py-0">
          <div className="mx-auto grid w-full grid-cols-2 gap-2 whitespace-nowrap">
            <ButtonWithCheck
              label="Request"
              value="withdraw"
              activeTab={activeTab}
              onClick={() => setActiveTab('withdraw')}
            />
            <ButtonWithCheck
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
            <Claim handleBack={handleBack} />
          </TabsContent>
        </Tabs>
      </SideDrawerLayout>
    </>
  );
}
