import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { TokenStation } from './token-station';

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Token Station" iconSrc={null}>
      <TokenStation />
    </CommonPageLayout>
  );
}
