import { useAppKitNetwork } from '@reown/appkit/react';
import { LoaderCircle } from 'lucide-react';
import { divide } from 'safebase';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import { ERROR_MESSAGES } from '@/config/const-msg';
import { NetworkConfigs } from '@/config/network-config';

import { ButtonWithCheck } from '@/components/common/button-with-check';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { Button } from '@/components/ui/button';

import { useAccountOrWalletBalanceByApi } from '@/lib/data/balance/use-account-or-wallet-balance-by-api';
import { IBadgeNft } from '@/lib/data/use-badge-nfts';
import { useBadgePurchase } from '@/lib/data/use-badge-purchase';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { useCheckAllowance } from '@/lib/data/use-check-allowance';
import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { truncateNumber } from '@/lib/utils/number';

import { BUY_TOKEN_CONFIG_BASE } from './buy-token-config';

export function PayWithToken({ selectedNft }: { selectedNft: IBadgeNft }) {
  const { address } = useAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();
  const [payToken, setPayToken] = useState<'ETH' | 'USDT' | 'USDC'>('ETH');

  const { data: userBadgeData } = useBadgeWalletNfts();

  const payTokenAddress = useMemo(() => {
    return BUY_TOKEN_CONFIG_BASE.find((token) => token.symbol === payToken)?.address || '';
  }, [payToken]);

  const { balance: tokenBalance, isBalancePending } = useAccountOrWalletBalanceByApi(
    NetworkConfigs.base.id,
    payTokenAddress
  );

  const { data: priceData, isLoading: isPriceLoading } = useTokenStationPrice();

  const { mutate: purchase, isPending: isPurchasePending } = useBadgePurchase();

  function handleToggleToken(token: 'ETH' | 'USDT' | 'USDC') {
    setPayToken(token);
    if (errorData.showError && errorData.errorMessage === ERROR_MESSAGES.INSUFFICIENT_BALANCE) {
      setErrorData({
        showError: false,
        errorMessage: '',
      });
    }
  }

  const {
    allowance: tokenAllowance,
    isLoading: isAllowanceLoading,
    handleApprove: handleApprove,
    isApproving: isApproving,
  } = useCheckAllowance('badge', payToken);

  const ETHPrice = useMemo(() => {
    if (!priceData) return '0';
    return priceData.eth_price;
  }, [priceData]);

  const price = selectedNft.price;

  const payNum = useMemo(() => {
    if (isPriceLoading || !priceData) return '-';

    if (payToken === 'ETH') {
      return truncateNumber(divide(String(price), String(ETHPrice)), 4);
    }
    return price;
  }, [price, ETHPrice, payToken, isPriceLoading, priceData]);

  const shouldApprove = useMemo(() => {
    if (!tokenAllowance) return true;
    return Number(tokenAllowance) < Number(payNum);
  }, [tokenAllowance, payNum]);

  const [errorData, setErrorData] = useState<{
    showError: boolean;
    errorMessage: string;
  }>({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (!address) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
    }
  }, [address, chainId]);

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) {
      return;
    }

    if (chainId !== NetworkConfigs.base.id) {
      switchNetwork(NetworkConfigs.base);
      return;
    }

    setInit(true);
  }, [init, chainId]);

  function handlePay() {
    if (chainId !== NetworkConfigs.base.id) {
      switchNetwork(NetworkConfigs.base);
    }

    if (shouldApprove) {
      handleApprove();
      return;
    }

    if (userBadgeData) {
      setErrorData({
        showError: true,
        errorMessage: 'You have already bought a badge',
      });
      return;
    }

    if (Number(tokenBalance) < Number(payNum)) {
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.INSUFFICIENT_BALANCE,
      });
      return;
    }

    purchase({
      nft_name: selectedNft.name,
      token_name: payToken,
    });
  }

  return (
    <div className="flex flex-col gap-5 mt-6">
      <div className="text-[#131E40] font-medium text-sm">Select payment token</div>

      <div className="flex justify-between">
        <ButtonWithCheck
          className="w-[93px]"
          label="ETH"
          value="ETH"
          activeTab={payToken}
          onClick={() => {
            handleToggleToken('ETH');
          }}
        />
        <ButtonWithCheck
          className="w-[93px]"
          label="USDT"
          value="USDT"
          activeTab={payToken}
          onClick={() => {
            handleToggleToken('USDT');
          }}
        />
        <ButtonWithCheck
          className="w-[93px]"
          label="USDC"
          value="USDC"
          activeTab={payToken}
          onClick={() => {
            handleToggleToken('USDC');
          }}
        />
      </div>

      <div>
        <Button
          disabled={isPurchasePending || isBalancePending || isPriceLoading || errorData.showError}
          onClick={handlePay}
          className="w-full bg-[#6E75F9] text-white rounded text-xs font-medium hover:bg-[#6E75F990] disabled:bg-[#6E75F990] disabled:text-white"
        >
          {isAllowanceLoading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : shouldApprove ? (
            <span>Approve</span>
          ) : isApproving ? (
            <span>Approving...</span>
          ) : isPurchasePending ? (
            <span>Paying...</span>
          ) : (
            <>
              <span>Pay</span>
              <span className="flex items-center gap-1">
                {isPriceLoading ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{payNum}</span>
                )}
              </span>
              <span>{payToken}</span>
            </>
          )}
        </Button>

        <ErrorMessage
          className="mt-2"
          show={errorData.showError}
          message={errorData.errorMessage}
        />
      </div>
    </div>
  );
}
