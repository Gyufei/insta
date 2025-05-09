export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

const ProdHost = '';
const DevHost = 'https://preview-sandbox-api.tadle.com';
const OddsProdHost = '';
const OddsDevHost = 'https://preview-odds-api.tadle.com';

export const ApiHost = isProduction ? ProdHost : DevHost;
export const OddsApiHost = isProduction ? OddsProdHost : OddsDevHost;

export const ApiPath = {
  account: `${ApiHost}/account/sandbox_account`,
  createAccount: `${ApiHost}/account/create_sandbox_account`,
  addAuthority: `${ApiHost}/account/enable`,
  deleteAuthority: `${ApiHost}/account/disable`,
  deposit: `${ApiHost}/account/deposit`,
  withdraw: `${ApiHost}/account/withdraw`,
  sendTx: `${ApiHost}/transaction/send`,
  faucetAirdrop: `${ApiHost}/airdrop/claim`,
  saveXBind: `${ApiHost}/x/bind`,

  aprioriInfo: `https://stake-api.apr.io/info`,
  aprioriBalance: `${ApiHost}/aprior/balance`,
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
  magmaBalance: `${ApiHost}/magma/balance`,
  magmaDeposit: `${ApiHost}/magma/deposit`,
  magmaWithdraw: `${ApiHost}/magma/withdraw`,

  uniswapQuote: `${ApiHost}/uniswap_router02/quote`,
  uniswapSwap: `${ApiHost}/uniswap_router02/buy`,
  uniswapV3Position: `${ApiHost}/uniswap_v3_position/all_positions`,
  uniswapCreatePoolAndMintPosition: `${ApiHost}/uniswap_v3_position/create_and_mint_pool`,
  uniswapMintPosition: `${ApiHost}/uniswap_v3_position/mint_pool`,
  uniswapAddLiquidity: `${ApiHost}/uniswap_v3_position/deposit`,
  uniswapRemoveLiquidity: `${ApiHost}/uniswap_v3_position/withdraw`,
  ambientPosition: `${ApiHost}/ambient_finance/positions`,
  ambientCreatePosition: `${ApiHost}/ambient_finance/create_pool_and_add_liquidity`,
  ambientAddLiquidity: `${ApiHost}/ambient_finance/add_liquidity`,
  ambientRemoveLiquidity: `${ApiHost}/ambient_finance/remove_liquidity`,

  oddsMarkets: `${OddsApiHost}/markets`,
  oddsWatchList: `${OddsApiHost}/user/watchlist`,
  oddsWatchListGet: `${OddsApiHost}/user/watchlist/get`,
  oddsMarketActivities: `${OddsApiHost}/markets/activities`,
  oddsVolumeLeader: `${OddsApiHost}/markets/rank/volume`,
  oddsMarketDetail: `${OddsApiHost}/market/{marketId}`,
  oddsMarketHolder: `${OddsApiHost}/market/{marketId}/holders`,
  oddsMarketItemActivity: `${OddsApiHost}/market/{marketId}/activities`,
  oddsUserPositions: `${OddsApiHost}/user/positions`,
  oddsMarketChart: `${OddsApiHost}/market/{marketId}/curve`,
  oddsMarketOrderbook: `${OddsApiHost}/market/{marketId}/orderbook`,
  oddsMarketRankProfit: `${OddsApiHost}/markets/rank/profit`,
  oddsMarketRankVolume: `${OddsApiHost}/markets/rank/volume`,

  oddsTrade: `${OddsApiHost}/market/{marketId}/trade`,
};
