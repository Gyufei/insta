import { Trash2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { NetworkConfigs } from '@/config/network-config';
import { formatAddress } from '@/lib/utils';
import { useSelectedAccount } from '@/lib/data/use-account';
import { useDeleteAuthority } from '@/lib/data/use-delete-authority';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

export function AuthorityCard({ manager }: { manager: string }) {
  const network = NetworkConfigs.monadTestnet;

  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { mutateAsync: deleteAuthority, isPending } = useDeleteAuthority();
  const account = accountInfo?.sandbox_account;

  const handleDelete = async () => {
    if (!address || !account) {
      return;
    }

    try {
      await deleteAuthority({
        wallet: address,
        sandbox_account: account,
        manager,
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <Card className="flex-shrink-0">
      <CardContent className="flex items-center px-4">
        <CardTitle className="mr-4 flex-grow text-xs font-medium text-gray-500">
          Authority
        </CardTitle>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`${network.blockExplorers.default.url}/address/${manager}`}
          className="text-sm font-medium text-blue-500"
        >
          {formatAddress(manager)}
        </a>
        <CardFooter className="ml-4 border-0 p-0">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none hover:bg-orange-500/15 focus:bg-orange-500/15 focus:outline-none disabled:opacity-50"
          >
            <Trash2 className="h-4 text-orange-500 dark:opacity-90" />
          </button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
