import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { C2CHeader } from './components/c2c-header';

export default function OddsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommonPageLayout title="Odds" iconSrc={null} pageConClx="p-0 pt-6">
      <C2CHeader />
      <div className="md:px-12 px-4">{children}</div>
    </CommonPageLayout>
  );
}
