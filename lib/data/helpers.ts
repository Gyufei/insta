import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { useSendTx } from '../web3/use-send-tx';
import { useAccount } from 'wagmi';
import { useSelectedAccount } from './use-account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Common parameter interface
export interface BaseParams {
  wallet: string;
  sandbox_account: string;
}

// Common API request function
export async function sendApiRequest<T>(url: string, params: Record<string, unknown>): Promise<T> {
  return Fetcher<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// Common GET request function
export async function fetchApiRequest<T>(url: string): Promise<T> {
  return Fetcher<T>(url);
}

// Common transaction handling function
export async function handleTransaction(
  txRes: ITxData | null | undefined,
  send: (txData: ITxData) => Promise<unknown>,
  _errorMessage: string
): Promise<void> {
  if (!txRes || !txRes.tx_data) {
    toast.error(ERROR_MESSAGES.INVALID_TX_DATA);
    return;
  }

  await send(txRes);
}

// Common wallet and account check
export function useWalletAndAccountCheck() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const account = accountInfo?.sandbox_account;

  const checkWalletAndAccount = (checkAddress: boolean, checkAccount: boolean) => {
    if (checkAddress && !address) {
      toast.info(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return false;
    }

    if (checkAccount && !account) {
      toast.info(ERROR_MESSAGES.ACCOUNT_NOT_CREATED);
      return false;
    }

    return true;
  };

  return {
    address,
    account,
    checkWalletAndAccount,
  };
}

// Common mutation hook factory
export function createMutationHook<TParams extends Record<string, unknown>>(
  apiPath: string,
  buildParams: (args: unknown, address: string, account: string) => TParams,
  errorMessage: string,
  extraArgs: {
    checkAddress: boolean;
    checkAccount: boolean;
    refreshQueryKey: readonly unknown[];
  }
) {
  return function useCustomMutation() {
    const queryClient = useQueryClient();
    const { address, account, checkWalletAndAccount } = useWalletAndAccountCheck();
    const { send, isPending: isSending } = useSendTx();

    async function executeMutation(args: unknown) {
      if (!checkWalletAndAccount(extraArgs.checkAddress, extraArgs.checkAccount)) {
        return;
      }

      const url = new URL(apiPath);
      const params = buildParams(args, address!, account!);

      try {
        const txRes = await sendApiRequest<ITxData>(url.toString(), params);
        await handleTransaction(txRes, send, errorMessage);
      } catch (err) {
        toast.error(errorMessage);
        throw err;
      }
    }

    const mutation = useMutation({
      mutationFn: executeMutation,
      onSuccess: () => {
        if (extraArgs?.refreshQueryKey?.length > 0) {
          queryClient.invalidateQueries({ queryKey: extraArgs.refreshQueryKey });
        }
      },
    });

    return {
      ...mutation,
      isPending: mutation.isPending || isSending,
    };
  };
}

// Common query hook factory
export function createQueryHook<TResponse>(
  apiPath: string,
  buildQueryKey: (account: string | undefined) => string[],
  buildUrl: (url: URL, account: string | undefined) => URL | null,
  extraArgs: {
    withAccount: boolean;
  }
) {
  return function useCustomQuery() {
    const { data: accountInfo } = useSelectedAccount();
    const account = accountInfo?.sandbox_account;

    async function executeQuery(): Promise<TResponse | null> {
      const url = buildUrl(new URL(apiPath), account);
      if (!url) {
        return null;
      }

      return fetchApiRequest<TResponse>(url.toString());
    }

    const queryResult = useQuery({
      queryKey: buildQueryKey(extraArgs.withAccount ? account : undefined),
      queryFn: () => executeQuery(),
      enabled: !extraArgs.withAccount || (extraArgs.withAccount && !!account),
    });

    return queryResult;
  };
}
