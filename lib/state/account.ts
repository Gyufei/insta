import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CurrentAccountAddressKey = 'Current_Account_Address';

export type CURRENT_ADDR_TYPE = 'EOA' | 'DSA';

type AccountState = {
  currentAccountAddress: string | null;
  setCurrentAccountAddress: (address: string | null) => void;
  currentAccountType: CURRENT_ADDR_TYPE;
  setCurrentAccountType: (type: CURRENT_ADDR_TYPE) => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      currentAccountType: 'DSA',
      setCurrentAccountType: (type) => set({ currentAccountType: type }),
      currentAccountAddress: null,
      setCurrentAccountAddress: (address) => set({ currentAccountAddress: address }),
    }),
    {
      name: CurrentAccountAddressKey,
    }
  )
);
