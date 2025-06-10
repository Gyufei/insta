import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { FavoritesProvider } from './common/favorite-context';
import OddsHeader from './components/odds-header';

export default function OddsLayout({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <CommonPageLayout title="Odds" iconSrc={null} pageConClx="p-0 2xl:p-0">
        <OddsHeader />
        {children}
      </CommonPageLayout>
    </FavoritesProvider>
  );
}
