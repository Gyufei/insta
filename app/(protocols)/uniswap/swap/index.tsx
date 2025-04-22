import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

import TokenSwap from './token-swap';

export function UniswapSwap() {
  const { setIsOpen } = useSideDrawerStore();

  return (
    <>
      <SideDrawerBackHeader title="Trade" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <TokenSwap />
      </SideDrawerLayout>
    </>
  );
}
