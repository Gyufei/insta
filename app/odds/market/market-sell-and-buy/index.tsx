import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

import TradingBox from '../../components/TradingBox';

export function OddsMarketSellAndBuy() {
  const { currentComponent } = useSideDrawerStore();
  const { handleBack } = useUrlPathDrawerChange('/odds');
  const { oddsMarket } = currentComponent?.props || {};

  if (!oddsMarket) {
    return null;
  }

  return (
    <>
      <SideDrawerBackHeader title="Odds Market Trade" onClick={handleBack} />
      <SideDrawerLayout>
        <TradingBox market={oddsMarket} />
      </SideDrawerLayout>
    </>
  );
}
