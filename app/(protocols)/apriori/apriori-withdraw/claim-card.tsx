import { formatDistanceToNow } from 'date-fns';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import { MONAD } from '@/config/tokens';
import { IAprioriClaim } from '@/lib/data/use-get-apriori-claim';
import { cn } from '@/lib/utils';
import { formatBig, formatNumber } from '@/lib/utils/number';

interface ClaimCardProps {
  claim: IAprioriClaim;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ClaimCard({ claim, isSelected = false, onSelect }: ClaimCardProps) {
  const monToken = MONAD;
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
    <Card
      className={cn(
        'group relative flex flex-shrink-0 cursor-pointer overflow-hidden select-none first:mt-0 py-0',
        isSelected ? 'border-2 border-blue-500' : ''
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
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
                src={monToken.logo}
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
      </CardContent>
    </Card>
  );
}
