import { AccountCard } from './account-card';
import { AccountAddressContainer } from './account-address-container';
import { AuthorityManage } from './authority-manage';

export function AccountDisplay() {
  return (
    <div>
      <div className="px-8 text-center text-[19px] font-semibold">Accounts</div>
      <div className="mt-4 grid grid-cols-1 pr-4 pl-8">
        <AccountCard />
      </div>
      <AccountAddressContainer />
      <AuthorityManage />
    </div>
  );
}
