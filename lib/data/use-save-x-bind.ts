import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '@/lib/fetcher';

import { useWalletAndAccountCheck } from './helpers';

interface SaveXBindRequest {
  code: string;
  redirect_uri: string;
}

interface SaveXBindResponse {
  id: string;
  name: string;
  username: string;
}

export function useSaveXBind() {
  const { address, account, checkWalletAndAccount } = useWalletAndAccountCheck();
  async function saveXBind(data: SaveXBindRequest) {
    if (!checkWalletAndAccount(true, true)) {
      return undefined;
    }

    const response = await Fetcher<SaveXBindResponse>('/api/x/bind', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: address!,
        sandbox_account: account!,
        code: data.code,
        redirect_uri: data.redirect_uri,
      }),
    });
    return response;
  }

  return useMutation<SaveXBindResponse | undefined, Error, SaveXBindRequest>({
    mutationFn: saveXBind,
  });
}
