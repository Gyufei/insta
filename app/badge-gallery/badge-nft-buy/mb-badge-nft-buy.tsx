import { BadgeNftBuyContent } from './badge-nft-buy-content';

export function MbBadgeNftBuy({
  selectedNftName,
  handleNftName,
}: {
  selectedNftName: string;
  handleNftName: (name: string | undefined) => void;
}) {
  function handleSelectNftName(name: string | undefined) {
    handleNftName(name);
  }

  return (
    <div className="md:hidden">
      <BadgeNftBuyContent nftName={selectedNftName} handleNftName={handleSelectNftName} />
    </div>
  );
}
