import { AccountList } from './account-list';
import { AuthorityManage } from './authority-manage';

export function AccountDisplay() {
  return (
    <>
      <div className="text-sm font-semibold mb-4 mt-8">DSA</div>
      <AccountList />
      <AuthorityManage />
    </>
  );
}
