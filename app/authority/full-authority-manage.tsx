import { AuthorityAdd } from '@/components/side-drawer/account-setting/account-display/authority-add';
import { AuthorityList } from '@/components/side-drawer/account-setting/account-display/authority-list';

export function FullAuthorityManage() {
  return (
    <div className="dark:bg-dark-500 flex w-full flex-shrink-0 flex-col gap-4 rounded bg-white p-6 shadow dark:shadow-none">
      <div data-v-f701bfb2="">
        <div data-v-f701bfb2="" className="text-grey-pure mb-2 flex text-sm leading-none">
          Add new Authority
        </div>
        <AuthorityAdd />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AuthorityList />
      </div>
    </div>
  );
}
