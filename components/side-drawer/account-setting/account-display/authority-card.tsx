import { Trash2 } from 'lucide-react';
import { useAccount } from 'wagmi';

import { NetworkConfigs } from '@/config/network-config';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useDeleteAuthority } from '@/lib/data/use-delete-authority';
import { formatAddress } from '@/lib/utils';

export function AuthorityCard({ manager }: { manager: string }) {
  const network = NetworkConfigs.monadTestnet;

  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { mutateAsync: deleteAuthority, isPending } = useDeleteAuthority();
  const account = accountInfo?.sandbox_account;

  const handleDelete = async () => {
    if (!address || !account || isPending) {
      return;
    }

    try {
      await deleteAuthority(manager);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <Card className="flex-shrink-0 py-[14px] border border-[#EBEBEB]">
      <CardContent className="flex items-center justify-between px-4">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`${network.blockExplorers.default.url}/address/${manager}`}
          className="text-sm font-medium text-primary"
        >
          {formatAddress(manager)}
        </a>
        <CardFooter className="ml-4 w-8 border-0 p-0">
          {address !== manager && (
            <Trash2
              className="h-4 text-[#A5ADC6] cursor-pointer hover:text-primary"
              onClick={handleDelete}
            />
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
