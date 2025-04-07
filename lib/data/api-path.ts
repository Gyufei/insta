export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

const ProdHost = '';
const DevHost = 'https://preview-sandbox-api.tadle.com';

export const ApiHost = isProduction ? ProdHost : DevHost;

export const ApiPath = {
  account: `${ApiHost}/account/sandbox_account`,
  createAccount: `${ApiHost}/account/create_sandbox_account`,
  addAuthority: `${ApiHost}/account/enable`,
  deleteAuthority: `${ApiHost}/account/disable`,
  deposit: `${ApiHost}/account/deposit`,
  withdraw: `${ApiHost}/account/withdraw`,
  sendTx: `${ApiHost}/transaction/send`,

  aprioriBalance: `${ApiHost}/aprior/balance`,
  aprioriDeposit: `${ApiHost}/aprior/deposit`,
  aprioriRequestClaim: `${ApiHost}/aprior/request_redeem`,
  aprioriClaim: `${ApiHost}/aprior/redeem`,
};
