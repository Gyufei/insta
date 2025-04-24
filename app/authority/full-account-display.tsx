import { Separator } from '@/components/ui/separator';
import { FullAccountAddress } from './full-account-address';
import { FullAuthorityManage } from './full-authority-manage';
import { FullAccountList } from './full-account-list';
import { TitleH2 } from '@/components/common/title-h2';

export default function FullAccountDisplay() {
  return (
    <>
      <FullAccountList />
      <div className="my-4 flex w-full items-center justify-center px-4 2xl:px-12">
        <Separator className="w-full" />
      </div>
      <div className="flex w-full flex-shrink-0 px-4 2xl:px-12">
        <FullAccountAddress />
      </div>
      <div className="mt-10 flex w-full flex-shrink-0 items-center justify-between px-4 2xl:px-12">
        <TitleH2>Authorities</TitleH2>
      </div>
      <div className="mt-6 flex w-full flex-shrink-0 px-4 2xl:px-12">
        <FullAuthorityManage />
      </div>
    </>
  );
}
