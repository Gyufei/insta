import { useAccountStore } from '@/lib/state/account';

import { AccountList } from './account-list';
import { AuthorityManage } from './authority-manage';

export function AccountDisplay() {
  const { currentAccountType } = useAccountStore();

  return (
    <>
      <div className="text-base font-semibold mb-4 mt-8">DSA</div>
      <AccountList />
      {currentAccountType === 'DSA' && (
        <>
          <AuthorityManage />
        </>
      )}
    </>
  );
}
