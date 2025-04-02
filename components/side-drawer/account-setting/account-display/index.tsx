import { useGetAccount } from '@/lib/data/use-get-account';
import { AccountCard } from './account-card';
import { AccountAddress } from './account-address';
import { AuthorityManage } from './authority-manage';

export function AccountDisplay() {
  const { data: accountInfo } = useGetAccount();

  return (
    <div>
      <div className="px-8 text-center text-[19px] font-semibold">Accounts</div>
      {accountInfo && (
        <>
          <div className="mt-4 grid grid-cols-1 pr-4 pl-8">
            <AccountCard accountInfo={accountInfo} />
          </div>
          <AccountAddress accountInfo={accountInfo} />
          <AuthorityManage />
        </>
      )}
    </div>
  );
}
