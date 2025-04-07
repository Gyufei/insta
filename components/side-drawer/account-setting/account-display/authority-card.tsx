import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { NetworkConfigs } from '@/config/network-config';
import { formatAddress } from '@/lib/utils';
import { useGetAccount } from '@/lib/data/use-get-account';
import { useDeleteAuthority } from '@/lib/data/use-delete-authority';

export function AuthorityCard({ manager }: { manager: string }) {
  const network = NetworkConfigs.monadTestnet;

  const { address } = useAccount();
  const { data: accountInfo } = useGetAccount();
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
      toast.success('Authority removed successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="dark:bg-dark-400 flex flex-shrink-0 items-center rounded bg-white p-4 shadow dark:shadow-none">
      <span className="text-grey-pure mr-4 flex-grow text-xs font-medium">Authority</span>{' '}
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`${network.blockExplorers.default.url}/address/${manager}`}
        className="text-ocean-blue-pure text-sm font-medium"
      >
        {formatAddress(manager)}
      </a>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="focus:bg-passion-orange-pure/15 hover:bg-passion-orange-pure/15 ml-4 flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      >
        <Trash2 className="text-passion-orange-pure h-4 dark:opacity-90" />
      </button>
    </div>
  );
}
