import { useGetAccount } from '@/lib/hooks/use-get-account';
import { useCreateAccount } from '@/lib/hooks/use-create-account';
import { formatAddress } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';

export function AccountBtn() {
  const { address } = useAppKitAccount();
  const { data: accountInfo } = useGetAccount(address);
  const { mutate: createAccount, isPending } = useCreateAccount();

  function handleCreate() {
    if (!address) return;
    createAccount(address);
  }

  return (
    <button
      className="bg-grey-pure/10 hover:bg-grey-pure/20 focus:bg-grey-pure/20 flex flex-shrink-0 items-center justify-center rounded-sm px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      style={{ minWidth: '5.75rem' }}
      onClick={handleCreate}
      disabled={isPending || !!accountInfo}
    >
      <div className="flex items-center justify-center leading-5">
        {accountInfo ? (
          <>
            Account:{' '}
            {formatAddress(accountInfo.address, {
              prefix: 3,
              suffix: 3,
            })}
          </>
        ) : (
          <>Create Account</>
        )}
      </div>
    </button>
  );
}
