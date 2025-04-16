import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { MyNames } from './my-names';

export default function NadNameServer() {
  return (
    <CommonPageLayout title="Nad Name Server" src="/icons/nad-name-server.svg">
      <MyNames />
    </CommonPageLayout>
  );
}
