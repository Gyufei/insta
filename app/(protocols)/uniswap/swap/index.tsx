import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function UniswapSwap() {
  const { setIsOpen } = useSideDrawerStore();

  return (
    <>
      <SideDrawerBackHeader title={`Transfer name`} onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <div></div>
      </SideDrawerLayout>
    </>
  );
}
