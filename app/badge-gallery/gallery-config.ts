export interface IBadgeNFT {
  id: string;
  name: string;
  price: string;
  releaseMonNum: number;
  releaseTimes: number;
  pic: string;
  level: number;
}

export const All_BADGES: IBadgeNFT[] = [
  {
    id: '1',
    name: 'Sergeant',
    price: '42',
    releaseMonNum: 30,
    releaseTimes: 40,
    pic: '/images/badge-nft/nft-1.jpeg',
    level: 1,
  },
  {
    id: '2',
    name: 'Captain',
    price: '114',
    releaseMonNum: 104,
    releaseTimes: 20,
    pic: '/images/badge-nft/nft-2.gif',
    level: 2,
  },
  {
    id: '3',
    name: 'Colonel',
    price: '235',
    releaseMonNum: 335,
    releaseTimes: 30,
    pic: '/images/badge-nft/nft-3.jpeg',
    level: 3,
  },
  {
    id: '4',
    name: 'General',
    price: '522',
    releaseMonNum: 1045,
    releaseTimes: 40,
    pic: '/images/badge-nft/nft-4.jpeg',
    level: 4,
  },
];
