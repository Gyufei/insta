export interface ITxResponse {
  tx_data: ITxData;
}

export interface ITxData {
  from: string;
  to: string;
  data: string;
  gas: number;
  value?: string;
  nonce?: string;
}
