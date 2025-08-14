import { Metadata } from 'next';
import { CommonPageLayout } from '@/components/layout/common-page-layout';
import FullAccountDisplay from './full-account-display';

export const metadata: Metadata = {
  title: 'Authority',
};

export default function Authority() {
  return (
    <CommonPageLayout title="Account Setting" iconSrc={null}>
      <FullAccountDisplay />
    </CommonPageLayout>
  );
}
