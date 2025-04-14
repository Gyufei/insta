import { Metadata } from 'next';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

export const metadata: Metadata = {
  title: 'Faucet | tadle',
};

export default function Faucet() {
  return (
    <CommonPageLayout title="Faucet" src="/icons/faucet.svg">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-300-500">This feature is under development</p>
      </div>
    </CommonPageLayout>
  );
}
