import React from "react";
import { Users, Star, Eye } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import MarketTitle from "./MarketTitle";
import { useEffect, useRef } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { Tooltip } from "../utils/Tooltip.ts";
import { formatCurrencyAmount } from "../utils/format";

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
  visitors: number;
}

export default function MarketCard({
  id = "",
  title = "",
  imageUrl = "",
  volume = "0",
  outcomes = [],
  visitors = 0,
}: MarketCardProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const starButtonRef = useRef<HTMLButtonElement>(null);

  // Validate required props
  if (!id || !title || !imageUrl || !Array.isArray(outcomes)) {
    return null;
  }

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const initTooltip = () => {
      requestAnimationFrame(() => {
        if (starButtonRef.current) {
          Tooltip.init(starButtonRef.current, {
            content: favorites[id]
              ? "Remove from watchlist"
              : "Add to watchlist",
          });
        }
      });
    };

    initTooltip();
  }, [favorites[id]]);

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
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <ImageWithFallback
        src={imageUrl || "/image/img_placeholder.png"}
        alt={title}
        className="w-full h-[108px] object-cover"
      />
      <div className="px-4">
        <div className="mt-4">
          <MarketTitle title={title} id={parseInt(id)} />
        </div>
        <div className="h-[74px] overflow-y-auto no-scrollbar space-y-[5px] mb-4">
          {outcomes.map((outcome, index) => (
            <div
              key={index}
              className="flex items-center justify-between h-[24px]"
            >
              <span className="text-gray-700 text-[15px]">
                {outcome.name || "Unknown"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium text-[15px]">
                  {outcome.probability}%
                </span>
                <div className="flex gap-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formatVisitors(outcome.players)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center h-[40px] justify-between py-2 border-t">
          <span className="text-sm text-gray-500">
            {formatCurrencyAmount(volume)}
          </span>
          <div className="flex items-center gap-4">
            <button
              ref={starButtonRef}
              tld-tooltip=""
              onClick={handleToggleFavorite}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Star
                className={`h-4 w-4 ${
                  favorites[id]
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-500"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
