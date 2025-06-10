import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { NadFunTokens } from './nadfun-tokens';
import { NadFunMyTokens } from './nadfun-my-tokens';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'nad.fun | tadle',
};

export default function NadFun() {
  return (
    <CommonPageLayout title="Nad.Fun" iconSrc="/icons/nad-fun.svg">
      <NadFunTokens />
      <NadFunMyTokens />
    </CommonPageLayout>
  );
}
