import { useSearchParams } from 'next/navigation';

import { isProduction } from '../data/api-path';

export function useTwitterSign() {
  const searchParams = useSearchParams();

  const scope = searchParams.get('scope');
  const isTwitterAuth = !scope || !scope?.includes('google');
  const code = isTwitterAuth ? searchParams.get('code') : null;
  const from = searchParams.get('from');
  const error = searchParams.get('error') || from?.includes('error');

  function goTwitter(cb: string) {
    window.location.href = isProduction
      ? `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access%20space.read&state=state&code_challenge=challenge&code_challenge_method=plain`
      : `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access%20space.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
  }

  function removeXVerifyCode() {
    const url = new URL(window.location.href);

    if (from) {
      url.searchParams.set('from', from.split('?')[0]);
      url.searchParams.delete('state');
    } else {
      url.searchParams.forEach((value, key) => {
        url.searchParams.delete(key);
      });
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
