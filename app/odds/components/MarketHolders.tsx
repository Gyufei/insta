import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ColorAvatar from './ColorAvatar';

interface Holder {
  user_name: string;
  user_avatar?: string;
  wallet?: string;
  user_id?: string;
  shares: string;
}

interface MarketHoldersProps {
  title: string;
  holders: Holder[];
  isPositive?: boolean;
}

export default function MarketHolders({ title, holders, isPositive = true }: MarketHoldersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm font-medium text-gray-500">SHARES</span>
      </div>
      <div className="space-y-4">
        {holders?.map((holder) => (
          <div
            key={holder.user_name || holder.wallet}
            className="flex items-center justify-between"
          >
            {holder.wallet || holder.user_id ? (
              <Link
                href={`/profile/${holder.wallet || holder.user_id}`}
                className="flex items-center gap-3 hover:text-blue-600"
              >
                {holder.user_avatar ? (
                  <Image src={holder.user_avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <ColorAvatar name={holder.user_name} className="w-8 h-8" />
                )}
                <span className="font-medium">{holder.user_name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {holder.user_avatar ? (
                  <Image
                    src={holder.user_avatar}
                    alt=""
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <ColorAvatar name={holder.user_name} className="w-8 h-8" />
                )}
                <span className="font-medium">{holder.user_name}</span>
              </div>
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {parseFloat(holder.shares).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
