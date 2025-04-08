import { AccountAddressCopy } from './account-address-copy';

export function AccountAddressContainer() {
  return (
    <div className="mt-6">
      <label
        htmlFor="dsa-address"
        className="text-navi-pure-light dark:text-light text-xs font-semibold"
      >
        Account address
      </label>
      <AccountAddressCopy className="rounded-sm shadow-sm" />
    </div>
  );
}
