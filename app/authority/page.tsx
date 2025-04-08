import { Metadata } from 'next';
import { CommonPageLayout } from '@/components/layout/common-page-layout';
import FullAccountDisplay from './full-account-display';

export const metadata: Metadata = {
  title: 'authority | tadle',
};

export default function Authority() {
  return (
    <CommonPageLayout title="Account Setting" src={null}>
      <FullAccountDisplay />
    </CommonPageLayout>
  );
}
