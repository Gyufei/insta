import { CommonPageLayout } from '@/components/layout/common-page-layout';

import OddsHeader from './common/odds-header';

export default function OddsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommonPageLayout title="Odds" src={null} pageConClx="p-0 2xl:p-0">
      <OddsHeader />
      {children}
    </CommonPageLayout>
  );
}
