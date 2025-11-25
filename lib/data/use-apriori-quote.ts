import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAprioriQuoteParams {
  token_in: string; // e.g. 'MON'
  token_out: string; // e.g. 'aprMON'
  amount: string; // e.g. '1'
}

export interface IAprioriQuoteResponse {
  token_in?: string;
  token_out?: string;
  amount_in_wei?: string;
  amount_out_wei?: string;
  amount_in?: string;
  amount_out?: string;
}

export function useAprioriQuote(params?: IAprioriQuoteParams) {
  return createQueryHook<IAprioriQuoteResponse>(
    ApiPath.aprioriQuote,
    () => [
      'aprior',
      'quote',
      params?.token_in || '',
      params?.token_out || '',
      params?.amount || '',
    ],
    (url) => {
      if (!params) return null;
      if (!params.token_in || !params.token_out || !params.amount) return null;
      url.searchParams.set('token_in', params.token_in);
      url.searchParams.set('token_out', params.token_out);
      url.searchParams.set('amount', params.amount);
      return url;
    },
    {
      withAccount: false,
      retry: false,
    }
  )();
}
