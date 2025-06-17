import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { BadgeContent } from './badge-content';

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Badge Gallery" iconSrc={null}>
      <BadgeContent />
    </CommonPageLayout>
  );
}
