import { useSearchParams } from 'next/navigation';

import { isProduction } from '../data/api-path';

export function useTwitterSign() {
  const searchParams = useSearchParams();

  const scope = searchParams.get('scope');
  const isTwitterAuth = !scope || !scope?.includes('google');
  const code = isTwitterAuth ? searchParams.get('code') : null;
  const error = searchParams.get('error');

  function goTwitter(cb: string) {
    window.location.href = isProduction
      ? `https://x.com/i/oauth2/authorize?response_type=code&client_id=NWxiS1k1WnpIVFpGdFg2YmtfQk46MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`
      : `https://x.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`;
  }

  function removeXVerifyCode() {
    const url = new URL(window.location.href);

    const keys = url.searchParams.keys();
    for (const key of keys.toArray()) {
      if (key !== 'chain') {
        url.searchParams.delete(key);
      }
    }

    window.history.replaceState({}, '', url.toString());
  }

  return {
    code: !scope ? code : null,
    error,
    goTwitter,
    removeXVerifyCode,
  };
}
