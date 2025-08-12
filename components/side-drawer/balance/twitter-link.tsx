import { useState } from 'react';

import Image from 'next/image';

export function TwitterLink() {
  const [isLink, setIsLink] = useState(false);
  const twitterName = 'test';

  function handleLink() {
    setIsLink(true);
  }

  return null;

  return (
    <div className="flex items-end gap-2">
      {isLink ? (
        <div className="flex items-center gap-1">
          <Image src="/icons/twitter-link.svg" alt="twitter-link" width={20} height={20} />
          <span className="text-[#A5ADC6] text-sm leading-[140%] font-medium">@{twitterName}</span>
        </div>
      ) : (
        <Image
          onClick={handleLink}
          className="cursor-pointer"
          src="/icons/twitter-unlink.svg"
          alt="twitter-link"
          width={20}
          height={20}
        />
      )}
    </div>
  );
}
