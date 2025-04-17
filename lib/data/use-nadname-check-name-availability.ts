import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface INadNameCheckAvailability {
  available: boolean;
}

export function useNadNameCheckAvailability(name: string) {
  return createQueryHook<INadNameCheckAvailability>(
    ApiPath.nadNameCheckAvailable,
    (_account) => ['nadname', 'check-availability', name],
    (url, _account) => {
      if (!name) return null;

      url.searchParams.set('name', name);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
