import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { MyNames } from './my-names';
import { SearchName } from './search-name';

export const metadata: Metadata = {
  title: 'Nad Name Service',
  openGraph: {
    title: 'Nad Name Service',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nad Name Service',
    creator: '@tadle_com',
  },
};

export default function NadNameService() {
  return (
    <CommonPageLayout title="Nad Name Service" iconSrc="/icons/nad-name-service.svg">
      <SearchName />
      <MyNames />
    </CommonPageLayout>
  );
}
