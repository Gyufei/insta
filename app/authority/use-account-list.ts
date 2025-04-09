import { useAccounts, useSelectedAccount } from '@/lib/data/use-account';
import { useAccount } from 'wagmi';
import { useCreateAccount } from '@/lib/data/use-create-account';
import { useAccountStore } from '@/lib/state/account';

export function useAccountList() {
  const { address } = useAccount();
  const { data: allAccounts } = useAccounts();
  const { data: currAccountInfo } = useSelectedAccount();
  const { setCurrentAccountAddress } = useAccountStore();
  const { mutateAsync: createAccount, isPending: isCreatePending } = useCreateAccount();

  async function handleCreateAccount() {
    if (!address) return;
    await createAccount(address);
  }

  function handleToggleAccount(accAddr: string) {
    if (currAccountInfo?.sandbox_account === accAddr) return;
    setCurrentAccountAddress(accAddr);
  }

  return {
    allAccounts,
    currAccountInfo,
    isCreatePending,
    handleCreateAccount,
    handleToggleAccount,
  };
}
