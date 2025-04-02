export interface ITxData {
  status: boolean;
  data: {
    from: string;
    to: string;
    data: string;
    gas: number;
  };
}
