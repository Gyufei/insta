import { AccountCard } from '@/components/side-drawer/account-setting/account-display/account-card';
import { HrLine } from '@/components/hr-line';
import { FullAccountAddress } from './full-account-address';
import { FullAuthorityManage } from './full-authority-manage';

export default function FullAccountDisplay() {
  return (
    <>
      <div className="mt-4 flex w-full flex-shrink-0 items-center justify-between px-4 2xl:mt-0 2xl:px-12">
        <h2 className="text-[18px] 2xl:text-2xl">Accounts</h2>
      </div>
      <div className="mt-16 flex w-full flex-shrink-0 px-4 2xl:px-12">
        <AccountCard className="w-32" />
      </div>
      <div className="my-4 flex w-full items-center justify-center px-4 2xl:px-12">
        <HrLine className="w-full" />
      </div>
      <div className="flex w-full flex-shrink-0 px-4 2xl:px-12">
        <FullAccountAddress />
      </div>
      <div className="mt-10 flex w-full flex-shrink-0 items-center justify-between px-4 2xl:px-12">
        <h2 className="text-xl 2xl:text-2xl">Authorities</h2>
      </div>
      <div className="2xl:px-12 mt-6 flex w-full flex-shrink-0 px-4">
        <FullAuthorityManage />
      </div>
    </>
  );
}
