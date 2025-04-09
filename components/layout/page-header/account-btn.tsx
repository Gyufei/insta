import { useSelectedAccount } from '@/lib/data/use-account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { Button } from '@/components/ui/button';

export function AccountBtn() {
  const { data: accountInfo, isLoading } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  const { setCurrentComponent } = useSideDrawerStore();

  function handleCreate() {
    if (!accountInfo) return;
    setCurrentComponent({ name: 'AccountSetting' });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-shrink-0 min-w-[5.75rem] text-xs font-semibold whitespace-nowrap"
      onClick={handleCreate}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center leading-5">
        {account ? <>Account(#{accountInfo.id})</> : <>Create Account</>}
      </div>
    </Button>
  );
}
