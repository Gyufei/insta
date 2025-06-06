import { useAccount } from 'wagmi';

import { WithLoading } from '@/components/common/with-loading';

import { useCreateAccount } from '@/lib/data/use-create-account';

import { DSAInfo } from './dsa-info';

export function NoAccountDisplay() {
  const { address } = useAccount();
  const { mutateAsync: createAccount, isPending } = useCreateAccount();

  async function handleCreateAccount() {
    if (!address) return;
    await createAccount(address);
  }

  return (
    <div className="flex flex-grow flex-col gap-4 px-6">
      <DSAInfo />

      <button
        onClick={handleCreateAccount}
        className="shadow-cta scale-xs flex flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-blue-500 px-4 py-2 text-sm leading-none font-semibold whitespace-nowrap text-primary-foreground duration-75 ease-out select-none focus:outline-none dark:shadow-none"
        style={{ minHeight: '24px' }}
        disabled={isPending || !address}
      >
        <WithLoading isLoading={!!isPending} className="mr-2" />
        Create DSA Account
      </button>
    </div>
  );
}
