import { useAccount } from 'wagmi';
import { DSAInfo } from './dsa-info';
import { useCreateAccount } from '@/lib/data/use-create-account';
import { WithLoading } from '@/components/with-loading';

export function NoAccountDisplay() {
  const { address } = useAccount();
  const { mutateAsync: createAccount, isPending } = useCreateAccount();

  return (
    <div className="flex flex-grow flex-col gap-4 px-6">
      <DSAInfo />

      <button
        onClick={() => address && createAccount(address)}
        className="bg-ocean-blue-pure text-14 shadow-cta scale-xs flex flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-4 py-2 leading-none font-semibold whitespace-nowrap text-white duration-75 ease-out select-none focus:outline-none dark:shadow-none"
        style={{ minHeight: '24px' }}
        disabled={isPending || !address}
      >
        <WithLoading isPending={!!isPending} className="mr-2" />
        Create DSA Account
      </button>
    </div>
  );
}
