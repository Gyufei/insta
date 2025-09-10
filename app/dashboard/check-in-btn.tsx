import { Loader } from 'lucide-react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';

import { useCheckIn } from '@/lib/data/check-in/use-check-in';
import { useIsCheckIn } from '@/lib/data/check-in/use-is-check-in';
import { cn } from '@/lib/utils';
import { useWalletConnect } from '@/lib/web3/use-wallet-connect';

export function CheckInBtn() {
  const { address } = useAccount();
  const { openWeb3Modal } = useWalletConnect();
  const { data: isCheckInData, isLoading: isCheckInLoading } = useIsCheckIn();
  const { mutate, isPending } = useCheckIn();
  const isCheckIn = isCheckInData?.has_checked_in_today;

  function handleCheckIn() {
    if (!address) {
      openWeb3Modal();
      return;
    }

    mutate(undefined);
  }

  return (
    <div className="relative mx-4 2xl:mx-12">
      <Button
        variant="outline"
        className={cn(
          'absolute -top-[70px] right-0 flex border-none disabled:opacity-100 items-center hover:bg-[#6E75F9]/90 hover:text-[#fff] px-[10px] h-8 text-xs font-medium',
          isCheckIn ? 'bg-[#F5F6F9] text-[#A5ADC6]' : 'bg-[#6E75F9] text-[#fff]'
        )}
        onClick={handleCheckIn}
        disabled={isCheckIn || isCheckInLoading || isPending}
      >
        {isCheckInLoading ? (
          <div className="w-[50px] flex justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center leading-[140%]">
            {isCheckIn ? (
              'Checked in'
            ) : isPending ? (
              <span>Checking...</span>
            ) : (
              <span>Check In</span>
            )}
          </div>
        )}
      </Button>
    </div>
  );
}
