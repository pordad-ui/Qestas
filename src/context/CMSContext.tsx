import React, { createContext, useContext, useState, useEffect } from 'react';
import { DynamicMenuItem, DynamicTextItem, MenuLocation } from '../types/cms';
import { INITIAL_DYNAMIC_MENUS, INITIAL_DYNAMIC_TEXTS } from '../data/cmsSeedData';

interface CMSContextType {
  menus: DynamicMenuItem[];
  textItems: DynamicTextItem[];
  texts: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  getMenusByLocation: (location: MenuLocation, includeInactive?: boolean) => DynamicMenuItem[];
  addMenu: (menu: Omit<DynamicMenuItem, 'id'>) => void;
  updateMenu: (id: string, updates: Partial<DynamicMenuItem>) => void;
  toggleMenuVisibility: (id: string) => void;
  reorderMenu: (id: string, direction: 'up' | 'down') => void;
  deleteMenu: (id: string) => void;
  updateText: (key: string, value: string) => void;
  resetAllToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const STORAGE_MENUS_KEY = 'dadgostar_dynamic_menus_v4';
const STORAGE_TEXTS_KEY = 'dadgostar_dynamic_texts_v4';

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Menus with fallback
  const [menus, setMenus] = useState<DynamicMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MENUS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading dynamic menus from localStorage', e);
    }
    return INITIAL_DYNAMIC_MENUS;
  });

  // Load Texts with fallback
  const [textItems, setTextItems] = useState<DynamicTextItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEXTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading dynamic texts from localStorage', e);
    }
    return INITIAL_DYNAMIC_TEXTS;
  });

  // Synchronize with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MENUS_KEY, JSON.stringify(menus));
    } catch (e) {
      console.error('Failed to save menus', e);
    }
  }, [menus]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TEXTS_KEY, JSON.stringify(textItems));
    } catch (e) {
      console.error('Failed to save texts', e);
    }
  }, [textItems]);

  // Fast text dictionary lookup
  const texts = React.useMemo(() => {
    const dict: Record<string, string> = {};
    textItems.forEach((item) => {
      dict[item.key] = item.value;
    });
    return dict;
  }, [textItems]);

  const t = (key: string, fallback = ''): string => {
    return texts[key] !== undefined ? texts[key] : fallback;
  };

  const getMenusByLocation = (location: MenuLocation, includeInactive = false) => {
    return menus
      .filter((m) => m.location === location && (includeInactive || m.is_active))
      .sort((a, b) => a.order - b.order);
  };

  const addMenu = (newMenu: Omit<DynamicMenuItem, 'id'>) => {
    const item: DynamicMenuItem = {
      ...newMenu,
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setMenus((prev) => [...prev, item]);
  };

  const updateMenu = (id: string, updates: Partial<DynamicMenuItem>) => {
    setMenus((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const toggleMenuVisibility = (id: string) => {
    setMenus((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      )
    );
  };

  const reorderMenu = (id: string, direction: 'up' | 'down') => {
    setMenus((prev) => {
      const targetItem = prev.find((m) => m.id === id);
      if (!targetItem) return prev;

      const locationItems = prev
        .filter((m) => m.location === targetItem.location)
        .sort((a, b) => a.order - b.order);

      const currentIndex = locationItems.findIndex((m) => m.id === id);
      if (currentIndex === -1) return prev;

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (swapIndex < 0 || swapIndex >= locationItems.length) return prev;

      const swapItem = locationItems[swapIndex];
      const targetOrder = targetItem.order;
      const swapOrder = swapItem.order;

      return prev.map((item) => {
        if (item.id === targetItem.id) {
          return { ...item, order: swapOrder };
        }
        if (item.id === swapItem.id) {
          return { ...item, order: targetOrder };
        }
        return item;
      });
    });
  };

  const deleteMenu = (id: string) => {
    setMenus((prev) => prev.filter((item) => item.id !== id));
  };

  const updateText = (key: string, value: string) => {
    setTextItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const resetAllToDefaults = () => {
    setMenus(INITIAL_DYNAMIC_MENUS);
    setTextItems(INITIAL_DYNAMIC_TEXTS);
    localStorage.removeItem(STORAGE_MENUS_KEY);
    localStorage.removeItem(STORAGE_TEXTS_KEY);
  };

  return (
    <CMSContext.Provider
      value={{
        menus,
        textItems,
        texts,
        t,
        getMenusByLocation,
        addMenu,
        updateMenu,
        toggleMenuVisibility,
        reorderMenu,
        deleteMenu,
        updateText,
        resetAllToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
