"use client";

import * as React from "react";

export type FavouriteItem = {
  cakeId: string;
  slug: string;
  category: string;
  name: string;
  image: string;
  price: number;
  addedAt: string;
};

type FavouritesContextValue = {
  favourites: FavouriteItem[];
  isFavourite: (cakeId: string) => boolean;
  toggleFavourite: (item: Omit<FavouriteItem, "addedAt">) => boolean;
  removeFavourite: (cakeId: string) => void;
  clearFavourites: () => void;
  count: number;
  hydrated: boolean;
};

const FavouritesContext = React.createContext<FavouritesContextValue | null>(null);
const STORAGE_KEY = "phibakes.favourites.v1";

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = React.useState<FavouriteItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // localStorage is unavailable during SSR, so hydrate on mount rather than
    // in a lazy initializer, which would cause a hydration mismatch.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setFavourites(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites, hydrated]);

  const isFavourite = React.useCallback(
    (cakeId: string) => favourites.some((f) => f.cakeId === cakeId),
    [favourites]
  );

  /** Returns the resulting state so callers can tailor their toast copy. */
  const toggleFavourite = React.useCallback(
    (item: Omit<FavouriteItem, "addedAt">) => {
      let nowFavourite = false;
      setFavourites((prev) => {
        const exists = prev.some((f) => f.cakeId === item.cakeId);
        nowFavourite = !exists;
        return exists
          ? prev.filter((f) => f.cakeId !== item.cakeId)
          : [{ ...item, addedAt: new Date().toISOString() }, ...prev];
      });
      return nowFavourite;
    },
    []
  );

  const removeFavourite = React.useCallback((cakeId: string) => {
    setFavourites((prev) => prev.filter((f) => f.cakeId !== cakeId));
  }, []);

  const clearFavourites = React.useCallback(() => setFavourites([]), []);

  const value = React.useMemo(
    () => ({
      favourites,
      isFavourite,
      toggleFavourite,
      removeFavourite,
      clearFavourites,
      count: favourites.length,
      hydrated,
    }),
    [favourites, isFavourite, toggleFavourite, removeFavourite, clearFavourites, hydrated]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const ctx = React.useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within a FavouritesProvider");
  return ctx;
}
