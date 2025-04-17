import { Metadata } from 'next';

import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { MyNames } from './my-names';
import { SearchName } from './search-name';

export const metadata: Metadata = {
  title: 'nadNameService | tadle',
};

export default function NadNameServer() {
  return (
    <CommonPageLayout title="Nad Name Server" src="/icons/nad-name-server.svg">
      <SearchName />
      <MyNames />
    </CommonPageLayout>
  );
}
