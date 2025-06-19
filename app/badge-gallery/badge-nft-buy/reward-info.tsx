import { divide, multiply, utils } from 'safebase';

import { useMemo } from 'react';

import { MONAD } from '@/config/tokens';

import { Progress } from '@/components/ui/progress';

import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { IBadgeNft } from '@/lib/data/use-badge-nfts';
import { formatNumber } from '@/lib/utils/number';

export function RewardInfo({ selectedNft }: { selectedNft: IBadgeNft }) {
  const { data: userBadgeData } = useBadgeWalletNfts();
  const isUserNft = userBadgeData?.nftInfo?.name === selectedNft.name;

  const total = selectedNft.total_release_times;
  const remainCount = isUserNft ? userBadgeData?.remainingClaims : 0;
  const claimedCount = total - Number(remainCount);

  const claimed =
    isUserNft && remainCount
      ? multiply(
          String(selectedNft.total_release_amount),
          divide(String(claimedCount), String(total))
        )
      : 0;

  const maxClaimable = divide(
    String(selectedNft.total_release_amount),
    String(selectedNft.total_release_times)
  );

  const nextClaimTime = useMemo(() => {
    if (!isUserNft) {
      return '-';
    }

    const nextClaimDayNum = userBadgeData ? userBadgeData?.claimInfo.last_claim_day : 0;
    const nextClaimDay = userBadgeData ? (Number(nextClaimDayNum) + 1) * 60 * 60 * 24 * 1000 : '-';

    if (!nextClaimDay) {
      return '-';
    }

    const nextClaimTime = new Date(nextClaimDay);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    } as const;
    return nextClaimTime.toLocaleString('en-US', options).replace(',', '');
  }, [isUserNft, userBadgeData]);

  // 进度条百分比
  const progress = utils.roundResult(divide(String(remainCount), String(total)), 2);

  return (
    <div className="flex flex-col border-y border-[#E6E6E6] py-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#131E40] font-medium text-sm">Rewards</span>
        <span className="text-[#131E40] font-normal text-xs">
          {remainCount}/{total}
        </span>
      </div>

      <Progress className="" value={progress} />

      <div className="flex flex-col gap-4 mt-5">
        <div className="flex justify-between">
          <span className="text-[#A5ADC6] text-sm font-normal">Claimed</span>
          <span className="text-[#131E40] font-medium text-sm">
            {formatNumber(claimed)} {MONAD.symbol}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#A5ADC6] text-sm font-normal">Max Claimable Every Time</span>
          <span className="text-[#131E40] font-medium text-sm">
            {formatNumber(maxClaimable)} {MONAD.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#A5ADC6] text-sm font-normal max-w-[140px] whitespace-break-spaces">
            Recommended Next <br />
            Claim Time
          </span>
          <span className="text-[#131E40] font-medium text-sm text-right max-w-[100px]">
            {nextClaimTime}
          </span>
        </div>
      </div>
    </div>
  );
}
