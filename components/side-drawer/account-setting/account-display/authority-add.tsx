import { useState } from 'react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAppKitAccount } from '@reown/appkit/react';

import { useCreateAuthority } from '@/lib/data/use-create-authority';
import { useGetAccount } from '@/lib/data/use-get-account';

export function AuthorityAdd() {
  const { address } = useAppKitAccount();
  const { data: accountInfo } = useGetAccount();
  const { mutateAsync: createAuthority, isPending } = useCreateAuthority();

  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    if (!address || !accountInfo?.sandbox_account) {
      return;
    }

    if (!isAddress(inputValue)) {
      toast.error('Invalid address format');
      return;
    }

    try {
      await createAuthority({
        wallet: address,
        sandbox_account: accountInfo.sandbox_account,
        manager: inputValue,
      });
      setInputValue('');
      toast.success('Authority added successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsError(false);
  };

  return (
    <div className="relative mt-4 flex flex-grow items-center">
      <input
        type="text"
        autoComplete="off"
        placeholder="New Authority"
        className={`border-grey-light dark:border-dark-300 h-10 w-full rounded-sm border bg-white py-3 pr-18 pl-8 text-xs ${
          isError ? 'border-red-500' : ''
        }`}
        style={{ paddingLeft: '0.75rem' }}
        value={inputValue}
        onChange={handleInputChange}
      />
      {isError && (
        <div className="absolute -bottom-4 left-0 text-xs text-red-500">Invalid address format</div>
      )}
      <button
        disabled={!inputValue || isPending}
        onClick={handleAdd}
        className="bg-ocean-blue-pure disabled:bg-grey-light dark:disabled:bg-dark-300 scale-down-sm hover:bg-ocean-blue-pale active:bg-ocean-blue-deep text-14 disabled:text-grey-pure absolute top-1 right-1 flex h-8 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-3 leading-none font-semibold text-white shadow-none duration-0 outline-none select-none focus:outline-none active:shadow-none"
      >
        <div className="flex w-full items-center justify-center truncate">
          <div className="flex items-center truncate py-0.5">
            {isPending ? 'Adding...' : 'Add'}
          </div>
        </div>
      </button>
    </div>
  );
}
