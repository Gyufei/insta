import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { MyNames } from './my-names';
import { SearchName } from './search-name';

export const metadata: Metadata = {
  title: 'nadNameService | tadle',
};

export default function NadNameService() {
  return (
    <CommonPageLayout title="Nad Name Service" iconSrc="/icons/nad-name-service.svg">
      <SearchName />
      <MyNames />
    </CommonPageLayout>
  );
}
