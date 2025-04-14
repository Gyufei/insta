'use client';
import { AccountAddressCopy } from '@/components/side-drawer/account-setting/account-display/account-address-copy';
import { useSelectedAccount } from '@/lib/data/use-account';
import { Card, CardContent } from '@/components/ui/card';

export function FullAccountAddress() {
  const { data: accountInfo } = useSelectedAccount();

  return (
    <Card className="w-full flex-shrink-0 dark:bg-slate-600 dark:shadow-none">
      <CardContent className="flex flex-col justify-between px-4 sm:flex-row">
        <div className="flex flex-col sm:mr-10">
          <div className="flex-grow text-xl">#{accountInfo?.id}</div>
          <AccountAddressCopy />
        </div>
      </CardContent>
    </Card>
  );
}
