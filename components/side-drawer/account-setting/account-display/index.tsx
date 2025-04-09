import { AccountAddressContainer } from './account-address-container';
import { AuthorityManage } from './authority-manage';
import { AccountList } from './account-list';

export function AccountDisplay() {
  return (
    <>
      <div className="text-center text-[19px] font-semibold">Accounts</div>
      <AccountList />
      <AccountAddressContainer />
      <AuthorityManage />
    </>
  );
}
