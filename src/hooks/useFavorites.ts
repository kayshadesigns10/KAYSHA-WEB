import { useState, useEffect } from 'react';
import { trackFavorite } from '@/lib/firebase';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('kaysha-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = (productId: string, productName: string) => {
    const updatedFavorites = [...favorites, productId];
    setFavorites(updatedFavorites);
    localStorage.setItem('kaysha-favorites', JSON.stringify(updatedFavorites));
    trackFavorite(productId, productName, 'add');
  };

  const removeFromFavorites = (productId: string, productName: string) => {
    const updatedFavorites = favorites.filter(id => id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('kaysha-favorites', JSON.stringify(updatedFavorites));
    trackFavorite(productId, productName, 'remove');
  };

  const toggleFavorite = (productId: string, productName: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId, productName);
    } else {
      addToFavorites(productId, productName);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
}