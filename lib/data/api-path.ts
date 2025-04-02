export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

const ProdHost = '';
const DevHost = 'https://mock.apipost.net/mock/429c9d08bce0000';

export const ApiHost = isProduction ? ProdHost : DevHost;

export const ApiPath = {
  account: `${ApiHost}/account/sandbox_account`,
  addAuthority: `${ApiHost}/account/enable`,
  deleteAuthority: `${ApiHost}/account/disable`,
};
