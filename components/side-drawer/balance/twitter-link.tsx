import { useAppKit } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useEffect } from 'react';

import TwitterLinkIcon from '@/components/icon/twitter-link-icon';

import { isProduction } from '@/lib/data/api-path';
import { useSaveXBind } from '@/lib/data/use-save-x-bind';
import { useTwitterInfo } from '@/lib/data/use-twitter-info';
import { cn } from '@/lib/utils';
import { useTwitterSign } from '@/lib/utils/use-twitter-sign';

export function TwitterLink() {
  const { address } = useAccount();
  const { open } = useAppKit();
  const { data: twitterInfo } = useTwitterInfo();

  const isLink = !!twitterInfo?.id;
  const twitterName = twitterInfo?.username || '';

  const { code, error, goTwitter, removeXVerifyCode } = useTwitterSign();
  const { mutate: saveXBind, isPending: isSavingXBind } = useSaveXBind();

  const Host = isProduction
    ? 'https://v3.tadle.com/uniswap?chain=monad'
    : 'https://preview-v3.tadle.com/uniswap?chain=monad';
  // 'http://localhost:3000/uniswap?chain=monad';

  function getCallbackUrl() {
    const current = window.location.origin + window.location.pathname + window.location.search;
    if (current?.includes('uniswap')) {
      return Host;
    }

    return Host; // + '?from=' + current;
  }

  useQuery({
    queryKey: code ? ['save-twitter', code] : [],
    queryFn: () => {
      const callbackUrl = sessionStorage.getItem('twitter-callbackUrl');

      saveXBind(
        {
          code: code!,
          redirect_uri: callbackUrl || Host,
        },
        {
          onSuccess: () => {
            removeXVerifyCode();
          },
          onError: () => {
            removeXVerifyCode();
          },
        }
      );
    },
    enabled: !!code,
  });

  useEffect(() => {
    if (error) {
      toast.error(error as string);
      removeXVerifyCode();
    }
  }, [error]);

  function handleGoTwitter() {
    if (!address) {
      open();
      return;
    }

    if (isSavingXBind || isLink) return;
    const cbUrl = getCallbackUrl();
    sessionStorage.setItem('twitter-callbackUrl', cbUrl);
    goTwitter(cbUrl);
  }

  return (
    <div className="flex items-end gap-2">
      <div
        className={cn(
          'flex items-center gap-1 px-[6px] h-6 rounded-[6px] border border-[#E0E0E0]',
          isLink ? 'border-[#32C34A]' : 'border-[#F3C024] cursor-pointer'
        )}
        onClick={handleGoTwitter}
      >
        <TwitterLinkIcon
          className={cn('w-5 h-5 scale-75', isLink ? 'text-[#32C34A]' : 'text-[#F3C024]')}
        />
        <div className="flex items-center gap-1">
          {isLink ? (
            <span
              title={twitterName}
              className={cn(
                'truncate max-w-[165px] text-xs text-[#32C34A] mt-[-2px] leading-[140%] font-medium',
                isLink ? 'text-[#32C34A]' : 'text-[#F3C024]'
              )}
            >
              @{twitterName}
            </span>
          ) : (
            <span className="text-[#F3C024] text-xs leading-[140%] font-medium">Connect</span>
          )}
        </div>
      </div>
    </div>
  );
}
