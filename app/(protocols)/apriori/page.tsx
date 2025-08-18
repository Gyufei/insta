import { Metadata } from 'next';

import { MateImageBase, MetaBaseHost } from '@/config/env-url';

import { TitleH2 } from '@/components/common/title-h2';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { AprMonStake } from './apr-mon-stake';
import { AprioriStats } from './apriori-stats';

export const metadata: Metadata = {
  title: 'Apriori',
  openGraph: {
    title: 'Apriori',
    url: MetaBaseHost,
    siteName: 'Tadle',
    images: `${MateImageBase}/UjXLk9pSW552Wq3jVMIQU.png`,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apriori',
    creator: '@tadle_com',
  },
};

export default function Apriori() {
  return (
    <CommonPageLayout title="Apriori" iconSrc="/icons/apriori.svg">
      <div className="md:mb-6 mb-4 flex w-full flex-shrink-0 justify-between px-4 mt-0 2xl:px-12">
        <TitleH2>Overview</TitleH2>
      </div>
      <AprioriStats />
      <div className="mt-6 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-4 2xl:px-12">
        <TitleH2>Staking</TitleH2>
      </div>
      <AprMonStake />
    </CommonPageLayout>
  );
}
