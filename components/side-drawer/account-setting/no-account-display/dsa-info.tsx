import { Check } from 'lucide-react';
import { useAccount } from 'wagmi';

import Image from 'next/image';

import { useAccountList } from '@/app/authority/use-account-list';

import { WithLoading } from '@/components/common/with-loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function DSAInfo() {
  const features = [
    { text: 'Multiple Owners' },
    { text: 'DeFi Composability' },
    { text: 'Assets Optimiztion' },
    { text: 'Authorities' },
    { text: 'Automation' },
  ];

  const { address } = useAccount();
  const { handleCreateAccount, isCreatePending, tooLessGasForCreate } = useAccountList();

  async function handleCreateAccountClick() {
    if (!address) return;
    await handleCreateAccount();
  }

  const isDisabled = isCreatePending || !address || tooLessGasForCreate;

  const button = (
    <button
      onClick={handleCreateAccountClick}
      className="shadow-cta scale-xs flex flex-shrink-0 cursor-pointer items-center justify-center rounded-sm bg-blue-500 px-4 py-2 text-sm leading-none font-semibold whitespace-nowrap text-primary-foreground duration-75 ease-out select-none focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed dark:shadow-none"
      style={{ minHeight: '24px' }}
      disabled={isDisabled}
    >
      <WithLoading isLoading={!!isCreatePending} className="mr-2" />
      Create DSA Account
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xxl">DeFi Smart Account</h2>
        <h3 className="text-xxl">(DSA)</h3>
      </div>

      <Image
        src="/images/account-cover.png"
        alt="DeFi Smart Account Cover"
        width={290}
        height={190}
      />

      {tooLessGasForCreate ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>Insufficient Monad gas for create account</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}

      <div>
        <h3 className="text-gray-300 mb-6">
          Build your Smart Account to enable Smart DeFi things.
        </h3>
        <ul className="mb-6 flex flex-col gap-4">
          {features.map((feature, index) => (
            <li key={index} className="text-base flex items-center justify-between">
              {feature.text}
              <Check className="text-green h-5 w-5 dark:opacity-90" strokeWidth={2} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
