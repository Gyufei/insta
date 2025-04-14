import { IAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { TokenData } from '@/lib/data/tokens';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { formatBig, formatNumber } from '@/lib/utils/number';

interface ClaimCardProps {
  claim: IAprioriClaim;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ClaimCard({ claim, isSelected = false, onSelect }: ClaimCardProps) {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const tokenAmount = formatNumber(formatBig(claim.token_amount));

  const requestTime = new Date(claim.request_at * 1000);
  const timeAgo = formatDistanceToNow(requestTime, { addSuffix: true });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-800';
      case 'pending':
        return 'text-yellow-800';
      case 'failed':
        return 'text-red-800';
      default:
        return 'text-gray-300-800';
    }
  };

  return (
    <div
      className={`group dark:bg-slate-300 dark:hover:bg-slate-200 relative flex flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded bg-white px-6 py-4 shadow select-none first:mt-0 hover:bg-gray-50 dark:shadow-none ${isSelected ? 'border-2 border-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="grid grid-cols-1 gap-1">
        <dl className="flex items-center">
          <dt className="text-gray-300 flex-1 text-xs font-medium">Status</dt>
          <dd
            className={`flex w-1/2 items-center justify-end gap-1 text-right text-xs font-semibold ${getStatusColor(claim.status)}`}
          >
            <span className="badge"></span>
            <span className="leading-normal">{claim.status}</span>
          </dd>
        </dl>

        <dl className="flex">
          <dt className="text-gray-300 flex-1 text-xs font-medium">Amount</dt>
          <dd className="flex w-1/2 items-center justify-end text-right text-xs font-semibold">
            <Image
              src={monToken.iconUrl}
              alt={monToken.symbol}
              width={16}
              height={16}
              className="mr-1"
            />
            {tokenAmount} {monToken.symbol}
          </dd>
        </dl>

        <dl className="flex">
          <dt className="text-gray-300 flex-1 text-xs font-medium">Request ID</dt>
          <dd className="flex w-1/2 items-center justify-end text-right text-xs font-semibold">
            {claim.request_id}
          </dd>
        </dl>

        <dl className="flex">
          <dt className="text-gray-300 flex-1 text-xs font-medium">Request Time</dt>
          <dd className="flex w-1/2 items-center justify-end text-right text-xs font-semibold">
            {timeAgo}
          </dd>
        </dl>
      </div>
    </div>
  );
}
