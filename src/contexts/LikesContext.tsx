import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikesContextType {
  likedItems: Set<string>;
  toggleLike: (itemId: string) => void;
  isLiked: (itemId: string) => boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isLiked = (itemId: string) => {
    return likedItems.has(itemId);
  };

  return (
    <LikesContext.Provider value={{ likedItems, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
