import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { NadFunMyTokens } from './nadfun-my-tokens';
import { NadFunTokens } from './nadfun-tokens';

export const metadata: Metadata = {
  title: 'Nad.Fun',
  openGraph: {
    title: 'Nad.Fun',
  },
  twitter: {
    title: 'Nad.Fun',
  },
};

export default function NadFun() {
  return (
    <CommonPageLayout title="Nad.Fun" iconSrc="/icons/nad-fun.svg">
      <NadFunTokens />
      <NadFunMyTokens />
    </CommonPageLayout>
  );
}
