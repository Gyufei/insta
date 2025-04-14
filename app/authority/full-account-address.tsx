'use client';
import { AccountAddressCopy } from '@/components/side-drawer/account-setting/account-display/account-address-copy';
import { useSelectedAccount } from '@/lib/data/use-account';

export function FullAccountAddress() {
  const { data: accountInfo } = useSelectedAccount();

  return (
    <div className="dark:bg-slate-600 flex w-full flex-shrink-0 flex-col justify-between rounded bg-white p-6 shadow sm:flex-row 2xl:h-40 dark:shadow-none">
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
