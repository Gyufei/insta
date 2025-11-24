export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
// export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;
export const isProduction = true;

const ProdHost = 'https://sb-api.tadle.com';
const DevHost = 'https://preview-sandbox-api.tadle.com';
const OddsProdHost = 'https://odds-api.tadle.com';
const OddsDevHost = 'https://preview-odds-api.tadle.com';

export const ApiHost = isProduction ? ProdHost : DevHost;
export const OddsApiHost = isProduction ? OddsProdHost : OddsDevHost;

export function WithCDN(path: string) {
  const prodCDN = `https://cdn.tadle.com`;
  const devCDN = `https://preview-cdn.tadle.com`;
  const cdn = isProduction ? prodCDN : devCDN;
  return `${cdn}${path}`;
}

export function WithProjectImgCDN(path: string, chain: string) {
  const goPath = path.endsWith('.png') ? path : `${path}.png`;
  return WithCDN(`/${chain}/images/project/${goPath}`);
}

export function WithPointImgCDN(path: string, chain: string) {
  const goPath = path.endsWith('.png') ? path : `${path}.png`;
  return WithCDN(`/${chain}/images/point/${goPath}`);
}

export const ApiPath = {
  metrics: `${ApiHost}/metrics`,

  account: `${ApiHost}/account/sandbox_account`,
  createAccount: `${ApiHost}/account/create_sandbox_account`,
  addAuthority: `${ApiHost}/account/enable`,
  deleteAuthority: `${ApiHost}/account/disable`,
  deposit: `${ApiHost}/account/deposit`,
  withdraw: `${ApiHost}/account/withdraw`,
  sendTx: `${ApiHost}/transaction/send`,
  faucetAirdrop: `${ApiHost}/airdrop/claim`,
  saveXBind: `${ApiHost}/x/bind`,
  accountBalance: `${ApiHost}/account/token_balance`,
  claimedAirdrop: `${ApiHost}/account/airdrop/amount`,
  imageUpload: `${ApiHost}/account/upload`,

  aprioriInfo: `https://stake-api.apr.io/info`,
  aprioriDeposit: `${ApiHost}/aprior/deposit`,
  aprioriRequestClaim: `${ApiHost}/aprior/request_redeem`,
  aprioriClaim: `${ApiHost}/aprior/redeem`,

  nadfunTokens: `${ApiHost}/nadfun/tokens`,
  nadfunMyTokens: `${ApiHost}/nadfun/my_tokens`,
  nadfunCreateToken: `${ApiHost}/nadfun/create_token`,
  nadfunTokenInfo: `${ApiHost}/nadfun/token_market_info`,
  nadfunBuyToken: `${ApiHost}/nadfun/buy`,
  nadfunSellToken: `${ApiHost}/nadfun/sell`,

  nadNameMyNames: `${ApiHost}/nadname/names`,
  nadNameMyPrimaryName: `${ApiHost}/nadname/primary_name`,
  nadNameSetPrimary: `${ApiHost}/nadname/set_primary_name`,
  nadNameRegister: `${ApiHost}/nadname/register`,
  nadNameCheckAvailable: `${ApiHost}/nadname/check_name_availability`,
  nadNamePrice: `${ApiHost}/nadname/registering_price`,
  nadNameTransfer: `${ApiHost}/nadname/transfer_ownership`,

  magmaInfo: 'https://magma-http-app-testnet-2.fly.dev/graphql',
  magmaDeposit: `${ApiHost}/magma/deposit`,
  magmaWithdraw: `${ApiHost}/magma/withdraw`,

  // Curvance Lending endpoints
  curvanceMarkets: `${ApiHost}/curvance/markets`,
  curvanceMarketUserInfo: `${ApiHost}/curvance/positions`,
  curvanceDeposit: `${ApiHost}/curvance/deposit`,
  curvanceWithdraw: `${ApiHost}/curvance/withdraw`,
  curvanceRepay: `${ApiHost}/curvance/repay`,
  curvanceBorrow: `${ApiHost}/curvance/borrow`,

  uniswapV3Position: `${ApiHost}/uniswap_v3_position/all_positions`,
  uniswapPositionInfo: `${ApiHost}/uniswap_v3_position/position_info`,
  uniswapQuote: `${ApiHost}/uniswap_router02/quote`,
  uniswapDSASwap: `${ApiHost}/uniswap_router02/buy`,
  uniswapEOASwap: `${ApiHost}/uniswap_router02/execute`,
  uniswapCreatePoolAndMintPosition: `${ApiHost}/uniswap_v3_position/create_and_mint_pool`,
  uniswapMintPosition: `${ApiHost}/uniswap_v3_position/mint_pool`,
  uniswapCreateToken: `${ApiHost}/uniswap_v3_position/create_token`,
  uniswapAddLiquidity: `${ApiHost}/uniswap_v3_position/deposit`,
  uniswapRemoveLiquidity: `${ApiHost}/uniswap_v3_position/withdraw`,
  uniswapLiquidityRatio: `${ApiHost}/uniswap_v3_position/liquidity_ratio`,
  uniswapTokens: `${ApiHost}/uniswap_v3_position/tokens`,

  // DEX unified endpoints
  dexQuote: `${ApiHost}/dex/quote`,
  dexEOAExecute: `${ApiHost}/dex/execute_by_eoa`,
  dexDSAExecute: `${ApiHost}/dex/execute_by_dsa`,

  ambientPosition: `${ApiHost}/ambient_finance/positions`,
  ambientPositionInfo: `${ApiHost}/ambient_finance/position_info`,
  ambientCreatePosition: `${ApiHost}/ambient_finance/create_pool_and_add_liquidity`,
  ambientAddLiquidity: `${ApiHost}/ambient_finance/add_liquidity`,
  ambientRemoveLiquidity: `${ApiHost}/ambient_finance/remove_liquidity`,
  ambientLiquidityRatio: `${ApiHost}/ambient_finance/liquidity_ratio`,
  ambientCalcImpact: `${ApiHost}/ambient_finance/calc_impact`,

  oddsUserInfo: `${ApiHost}/odds/user/info`,
  oddsWatchList: `${OddsApiHost}/user/watchlist`,
  oddsWatchListGet: `${OddsApiHost}/user/watchlist/get`,
  oddsOrders: `${OddsApiHost}/user/orders`,
  oddsUserPositions: `${OddsApiHost}/user/position`,
  oddsTradingBalance: `${OddsApiHost}/user/trading_balance`,
  oddsUserMarkets: `${OddsApiHost}/user/markets`,
  oddsCloseOrder: `${OddsApiHost}/user/orders/close`,

  oddsMarkets: `${OddsApiHost}/markets`,
  oddsUploadImage: `${OddsApiHost}/user/uploadImage`,
  oddsMarketCreate: `${OddsApiHost}/market/create`,
  oddsMarketActivities: `${OddsApiHost}/markets/activities`,
  oddsVolumeLeader: `${OddsApiHost}/markets/rank/volume`,
  oddsMarketDetail: `${OddsApiHost}/market/{marketId}`,
  oddsMarketHolder: `${OddsApiHost}/market/{marketId}/holders`,
  oddsMarketItemActivity: `${OddsApiHost}/market/{marketId}/activities`,
  oddsMarketChart: `${OddsApiHost}/market/{marketId}/curve`,
  oddsMarketOrderbook: `${OddsApiHost}/market/{marketId}/orderbook`,
  oddsMarketRankProfit: `${OddsApiHost}/markets/rank/profit`,
  oddsMarketRankVolume: `${OddsApiHost}/markets/rank/volume`,
  oddsTrade: `${OddsApiHost}/market/{marketId}/trade`,
  oddsCancelOrder: `${OddsApiHost}/market/orders/cancel`,

  oddsDeposit: `${ApiHost}/odds/deposit`,
  oddsWithdraw: `${ApiHost}/odds/withdraw`,
  oddsClaim: `${ApiHost}/odds/claim`,

  tokenStationPrice: `${ApiHost}/token_station/price`,
  tokenStationSwapCCIP: `${ApiHost}/token_station/ccip/swap`,
  tokenStationSwapBridge: `${ApiHost}/token_station/bridge/swap`,
  tokenStationAllowanceCCIP: `${ApiHost}/token_station/ccip/allowance`,
  tokenStationAllowanceBridge: `${ApiHost}/token_station/bridge/allowance`,

  badgeNfts: `${ApiHost}/badge/market/nfts`,
  badgeWalletNft: `${ApiHost}/badge/{wallet}/nft`,
  badgeAllowance: `${ApiHost}/badge/allowance`,
  badgePurchase: `${ApiHost}/badge/purchase`,
  badgeClaim: `${ApiHost}/badge/claim`,

  twitterBind: `${ApiHost}/account/twitter`,
  twitterInfo: `${ApiHost}/account/twitter_info`,

  checkIn: `${ApiHost}/account/checkin`,
  checkInComplete: `${ApiHost}/account/checkin/complete`,
  checkInToday: `${ApiHost}/account/checkin/today`,

  monadTokenInfo: `${ApiHost}/token/info`,
  monadTokenBalance: `${ApiHost}/token/balance`,
  monadTokenAllowance: `${ApiHost}/token/allowance`,
};
