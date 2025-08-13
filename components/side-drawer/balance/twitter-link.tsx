import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useEffect } from 'react';

import Image from 'next/image';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useSaveXBind } from '@/lib/data/use-save-x-bind';
import { useTwitterSign } from '@/lib/utils/use-twitter-sign';

export function TwitterLink() {
  const { address } = useAccount();
  const { data: selectedAccount } = useSelectedAccount();
  const isLink = !!selectedAccount?.twitter_info?.id;
  const twitterName = selectedAccount?.twitter_info?.username || '';

  const { code, error, goTwitter, removeXVerifyCode } = useTwitterSign();
  const { mutate: saveXBind, isPending: isSavingXBind } = useSaveXBind();

  function getCallbackUrl() {
    return window.location.origin + window.location.pathname + window.location.search;
  }

  useQuery({
    queryKey: code ? ['save-twitter', code] : [],
    queryFn: () =>
      saveXBind({
        code: code!,
        redirect_uri: getCallbackUrl(),
      }),
    enabled: !!code,
  });

  useEffect(() => {
    if (error) {
      removeXVerifyCode();
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      toast.error(error as string);
      removeXVerifyCode();
    }
  }, [error]);

  function handleGoTwitter() {
    if (isSavingXBind) return;
    const url = new URL(window.location.href);
    goTwitter(url.toString());
  }

  if (!address) return null;

  return (
    <div className="flex items-end gap-2">
      {isLink ? (
        <div className="flex items-center gap-1">
          <Image src="/icons/twitter-link.svg" alt="twitter-link" width={20} height={20} />
          <span className="text-[#A5ADC6] text-sm leading-[140%] font-medium">@{twitterName}</span>
        </div>
      ) : (
        <Image
          onClick={handleGoTwitter}
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
