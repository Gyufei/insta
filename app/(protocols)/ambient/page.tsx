import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AmbientPositionsSection } from './ambient-position-section';

export const metadata: Metadata = {
  title: 'Ambient Finance | tadle',
};

export default function AmbientPage() {
  return (
    <CommonPageLayout title="Ambient" iconSrc="/icons/ambient.svg">
      <AmbientPositionsSection />
    </CommonPageLayout>
  );
}
