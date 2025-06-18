import { Progress } from '@/components/ui/progress';

import { IBadgeNft } from '@/lib/data/use-badge-nfts';

export function RewardInfo({ selectedNft: _selectedNft }: { selectedNft: IBadgeNft }) {
  // 假数据，后续可通过 props 传递
  const claimed = 1292941;
  const maxClaimable = 1292941;
  const total = 20;
  const claimedCount = 7;
  const nextClaimTime = 'Jun 7 2025, 09:01:00';
  const token = 'MON';

  // 进度条百分比
  const progress = (claimedCount / total) * 100;

  return (
    <div className="bg-gray-200 p-6 rounded-lg w-[400px]">
      {/* 进度条 */}
      <div className="mb-6">
        <Progress value={progress} />
      </div>
      {/* 标题和数量 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 text-lg">Rewards</span>
        <span className="text-gray-700 text-lg">
          {claimedCount}/{total}
        </span>
      </div>
      {/* 奖励信息 */}
      <div className="ml-2">
        <div className="flex justify-between mb-1">
          <span className="text-gray-800 text-xl">Claimed</span>
          <span className="text-gray-800 text-xl">
            {claimed} {token}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-800 text-lg">Max Claimable Every Time</span>
          <span className="text-gray-800 text-lg">
            {maxClaimable} {token}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-800 text-lg">Recommended Next Claim Time</span>
          <span className="text-gray-800 text-lg">{nextClaimTime}</span>
        </div>
      </div>
    </div>
  );
}
