'use client';

import { AccountAddressCopy } from '@/components/side-drawer/account-setting/account-display/account-address-copy';
import { Card, CardContent } from '@/components/ui/card';

import { useSelectedAccount } from '@/lib/data/use-account';

export function FullAccountAddress() {
  const { data: accountInfo } = useSelectedAccount();

  return (
    <Card className="w-full flex-shrink-0">
      <CardContent className="flex flex-col justify-between px-4 sm:flex-row">
        <div className="flex flex-col sm:mr-10">
          <div className="flex-grow text-xl">#{accountInfo?.id}</div>
          <AccountAddressCopy />
        </div>
      </CardContent>
    </Card>
  );
}
