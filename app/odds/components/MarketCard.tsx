import { Star, Users } from 'lucide-react';

import Image from 'next/image';

import { useFavorites } from '@/app/odds/common/favorite-context';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { formatCurrency } from '@/lib/utils/number';

import MarketTitle from './MarketTitle';

interface Outcome {
  name: string;
  probability: number;
  status?: string;
  players: number;
}

interface MarketCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  volume: string;
  outcomes: Outcome[];
}

export default function MarketCard({
  id = '',
  title = '',
  imageUrl = '',
  volume = '0',
  outcomes = [],
}: MarketCardProps) {
  const { favorites, toggleFavorite } = useFavorites();

  // Validate required props
  if (!id || !title || !imageUrl || !Array.isArray(outcomes)) {
    return null;
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const formatVisitors = (count: number) => {
    const visitorCount = Number(count) || 0;

    if (visitorCount >= 1000000) {
      return `${(visitorCount / 1000000).toFixed(1)}m`;
    }
    if (visitorCount >= 1000) {
      return `${(visitorCount / 1000).toFixed(1)}k`;
    }
    return visitorCount.toString();
  };

  // Ensure we have a valid ID
  if (!id) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-none transition-shadow">
      <Image
        src={imageUrl || '/image/img_placeholder.png'}
        alt={title}
        width={300}
        height={108}
        className="w-full h-[108px] object-cover"
      />
      <div className="px-4">
        <div className="mt-4">
          <MarketTitle title={title} id={parseInt(id)} />
        </div>
        <div className="h-[74px] overflow-y-auto no-scrollbar space-y-[5px] mb-4">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex items-center justify-between h-[24px]">
              <span className="text-gray-700 text-[15px]">{outcome.name || 'Unknown'}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium text-[15px]">
                  {outcome.probability}%
                </span>
                <div className="flex gap-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{formatVisitors(outcome.players)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center h-[40px] justify-between py-2 border-t">
          <span className="text-sm text-gray-500">${formatCurrency(volume)}</span>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    tld-tooltip=""
                    onClick={handleToggleFavorite}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        favorites[id] ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'
                      }`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px]">
                  <p className="text-xs">
                    {favorites[id] ? 'Remove from watchlist' : 'Add to watchlist'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
