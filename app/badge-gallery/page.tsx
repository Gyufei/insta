import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { BadgeContent } from './badge-content';

export const metadata: Metadata = {
  title: 'Badge Gallery',
  openGraph: {
    title: 'Badge Gallery',
  },
  twitter: {
    title: 'Badge Gallery',
  },
};

export default function TokenStationPage() {
  return (
    <CommonPageLayout title="Badge Gallery" iconSrc={null}>
      <BadgeContent />
    </CommonPageLayout>
  );
}
