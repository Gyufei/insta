import { useSelectedAccount } from '@/lib/data/use-account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function AccountBtn() {
  const { data: accountInfo, isLoading } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  const { setCurrentComponent } = useSideDrawerStore();

  function handleCreate() {
    if (!accountInfo) return;
    setCurrentComponent({ name: 'AccountSetting' });
  }

  return (
    <button
      className="bg-grey-pure/10 hover:bg-grey-pure/20 focus:bg-grey-pure/20 flex flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      style={{ minWidth: '5.75rem' }}
      onClick={handleCreate}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center leading-5">
        {account ? <>Account(#{accountInfo.id})</> : <>Create Account</>}
      </div>
    </button>
  );
}
