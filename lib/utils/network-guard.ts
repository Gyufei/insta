import * as Sentry from '@sentry/nextjs';
import { toast } from 'sonner';

import { NetworkConfigs } from '@/config/network-config';

type EnsureOptions = {
  chainId?: number | string | null;
  toastMessage?: string;
  onFailToast?: boolean;
  sentryTags?: Record<string, string>;
  sentryExtra?: Record<string, unknown>;
};

export function ensureMonadNetworkSync(options: EnsureOptions): boolean {
  const { chainId, toastMessage, onFailToast = true } = options || {};
  const targetLabel = 'Monad Testnet';
  const targetId = NetworkConfigs.monadTestnet.id;

  if (!chainId || chainId !== targetId) {
    if (onFailToast) {
      toast.error(
        toastMessage ||
          `Wrong network detected in your wallet! Switch to ${targetLabel} to avoid loss.`
      );
    }
    return false;
  }
  return true;
}

export async function ensureMonadNetwork(
  options: EnsureOptions & {
    switchNetwork?: (target: { id: number }) => Promise<void>;
  }
): Promise<boolean> {
  const {
    chainId,
    toastMessage,
    onFailToast = true,
    switchNetwork,
    sentryTags,
    sentryExtra,
  } = options || {};
  const targetLabel = 'Monad Testnet';
  const targetId = NetworkConfigs.monadTestnet.id;

  if (!chainId || chainId !== targetId) {
    try {
      if (switchNetwork) {
        await switchNetwork(NetworkConfigs.monadTestnet);
        // 与现有逻辑保持一致：切换后仍提示并阻止继续执行，让用户再次点击操作
      }
      if (onFailToast) {
        toast.error(
          toastMessage ||
            `Wrong network detected in your wallet! Switch to ${targetLabel} to avoid loss.`
        );
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { ...(sentryTags || {}), error_type: 'network_switch' },
        extra: { ...(sentryExtra || {}), current_chain_id: chainId },
      });
      if (onFailToast) {
        toast.error(
          toastMessage ||
            `Wrong network detected in your wallet! Switch to ${targetLabel} to avoid loss.`
        );
      }
    }
    return false;
  }
  return true;
}
