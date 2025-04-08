'use client';
import { AccountAddressCopy } from '@/components/side-drawer/account-setting/account-display/account-address-copy';
import { useGetAccount } from '@/lib/data/use-get-account';

export function FullAccountAddress() {
  const { data: accountInfo } = useGetAccount();

  return (
    <div className="dark:bg-dark-500 flex w-full flex-shrink-0 flex-col justify-between rounded bg-white p-6 shadow sm:flex-row 2xl:h-40 dark:shadow-none">
      <div className="flex flex-col sm:mr-10">
        <div className="flex-grow text-xl">#{accountInfo?.id}</div>
        <div>
          <div className="text-base font-medium">Account address</div>
          <AccountAddressCopy />
        </div>
      </div>
    </div>
  );
}
