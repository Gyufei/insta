import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

import TradingBox from '../../components/TradingBox';

export function OddsMarketSellAndBuy() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { oddsMarket } = currentComponent?.props || {};

  if (!oddsMarket) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Odds Market Trade" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <TradingBox market={oddsMarket} />
      </SideDrawerLayout>
    </>
  );
}
