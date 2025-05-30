'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { useOddsUserInfo } from './use-user-info';
import { useWatchList } from './use-watchlist';
import { useWatchListAction } from './use-watchlist-mutation';

const WATCH_LIST_STORAGE_KEY = 'tadle_watchlist';

interface FavoritesContextType {
  favorites: Record<string, boolean>;
  toggleFavorite: (marketId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  const { data: watchList } = useWatchList();
  const { addToWatchList } = useWatchListAction();

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(WATCH_LIST_STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = async (marketId: string) => {
    const newFavorites = {
      ...favorites,
      [marketId]: !favorites[marketId],
    };
    setFavorites(newFavorites);

    // 将 localStorage 操作移到 useEffect 中
    if (typeof window !== 'undefined') {
      localStorage.setItem(WATCH_LIST_STORAGE_KEY, JSON.stringify(newFavorites));
    }

    if (!userId) {
      return;
    }

    try {
      const action = favorites[marketId] ? 'remove' : 'add';
      await addToWatchList.mutateAsync({
        marketId,
        action,
      });
    } catch (err) {
      // Revert optimistic update on error
      const revertedFavorites = {
        ...favorites,
        [marketId]: favorites[marketId],
      };
      setFavorites(revertedFavorites);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WATCH_LIST_STORAGE_KEY, JSON.stringify(revertedFavorites));
      }
    }
  };

  useEffect(() => {
    if (!userId || !watchList?.markets) {
      return;
    }

    if (Array.isArray(watchList?.markets)) {
      const serverFavorites = watchList.markets.reduce(
        (acc: Record<string, boolean>, id: string) => {
          acc[id] = true;
          return acc;
        },
        {}
      );
      setFavorites(serverFavorites);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WATCH_LIST_STORAGE_KEY, JSON.stringify(serverFavorites));
      }
    }
  }, [userId, watchList]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
