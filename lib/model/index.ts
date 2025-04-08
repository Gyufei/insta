export interface ITxData {
  tx_data: {
    from: string;
    to: string;
    data: string;
    gas: number;
    value?: string;
  };
}
