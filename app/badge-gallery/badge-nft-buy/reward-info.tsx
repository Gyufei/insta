import { Progress } from '@/components/ui/progress';

import { formatNumber } from '@/lib/utils/number';

export function RewardInfo() {
  const claimed = 1292941;
  const maxClaimable = 1292941;
  const total = 20;
  const claimedCount = 7;
  const nextClaimTime = 'Jun 7 2025, 09:01:00';
  const token = 'MON';

  // 进度条百分比
  const progress = (claimedCount / total) * 100;

  return (
    <div className="flex flex-col border-y border-[#E6E6E6] py-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#131E40] font-medium text-sm">Rewards</span>
        <span className="text-[#131E40] font-normal text-xs">
          {claimedCount}/{total}
        </span>
      </div>

      <Progress className="" value={progress} />

      <div className="flex flex-col gap-4 mt-5">
        <div className="flex justify-between">
          <span className="text-[#A5ADC6] text-sm font-normal">Claimed</span>
          <span className="text-[#131E40] font-medium text-sm">
            {formatNumber(claimed)} {token}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#A5ADC6] text-sm font-normal">Max Claimable Every Time</span>
          <span className="text-[#131E40] font-medium text-sm">
            {maxClaimable} {token}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A5ADC6] text-sm font-normal max-w-[40%]">
            Recommended Next <br /> Claim Time
          </span>
          <span className="text-[#131E40] font-medium text-sm text-right max-w-[100px]">
            {nextClaimTime}
          </span>
        </div>
      </div>
    </div>
  );
}
