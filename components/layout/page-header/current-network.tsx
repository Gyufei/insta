import { ERROR_MESSAGES } from '@/config/error-msg';
import { MonadTestnetName, NetworkConfigs } from '@/config/network-config';
import { useAppKitNetwork } from '@reown/appkit/react';
import { TriangleAlert, CheckCircle2, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/side-drawer/common/status-badge';

export function CurrentNetwork() {
  const { chainId, caipNetwork, switchNetwork } = useAppKitNetwork();
  const isRightNetwork = chainId === NetworkConfigs.monadTestnet.id;
  const networkName = isRightNetwork ? MonadTestnetName : caipNetwork?.name || 'Unknown Network';

  async function handleSwitchNetwork() {
    if (isRightNetwork) {
      return;
    }

    try {
      await switchNetwork(NetworkConfigs.monadTestnet);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.FAIL_TO_SWITCH_NETWORK);
    }
  }

  return (
    <div className="ml-4">
      {isRightNetwork ? (
        <StatusBadge
          status="success"
          leftIcon={CheckCircle2}
          leftLabel={networkName}
          rightLabel={<Link2 className="size-4" />}
          className="hidden sm:inline-flex"
        />
      ) : (
        <div className="flex flex-col">
          <StatusBadge
            status="error"
            leftIcon={TriangleAlert}
            leftLabel={networkName}
            rightLabel={
              <button
                type="button"
                onClick={handleSwitchNetwork}
                className="cursor-pointer text-xs font-medium text-blue-500 hover:text-blue-600"
              >
                Switch to {MonadTestnetName}
              </button>
            }
            className="hidden sm:inline-flex"
          />
        </div>
      )}
    </div>
  );
}
