import { useState, useEffect } from "react";
import { getAllTools, Tool } from "@/data/toolCategories";

const RECENT_TOOLS_KEY = "dailytools247_recent_tools";
const FAVORITES_KEY = "dailytools247_favorite_tools";
const MAX_RECENT_TOOLS = 10;

export interface RecentToolItem {
  id: string;
  path: string;
  name: string;
  category?: string;
  lastUsed: number;
}

// Helper to get stored list from localStorage safely
function getStoredJson<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("dailytools_storage_update"));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

export const userToolsStore = {
  getRecentTools(): RecentToolItem[] {
    return getStoredJson<RecentToolItem[]>(RECENT_TOOLS_KEY, []);
  },

  addRecentTool(tool: { id: string; path: string; name: string; category?: string }) {
    const current = this.getRecentTools().filter((t) => t.path !== tool.path);
    const updated: RecentToolItem[] = [
      {
        id: tool.id,
        path: tool.path,
        name: tool.name,
        category: tool.category,
        lastUsed: Date.now(),
      },
      ...current,
    ].slice(0, MAX_RECENT_TOOLS);
    setStoredJson(RECENT_TOOLS_KEY, updated);
  },

  clearRecentTools() {
    setStoredJson(RECENT_TOOLS_KEY, []);
  },

  getFavorites(): string[] {
    return getStoredJson<string[]>(FAVORITES_KEY, []);
  },

  isFavorite(toolPathOrId: string): boolean {
    const favs = this.getFavorites();
    return favs.includes(toolPathOrId);
  },

  toggleFavorite(toolPathOrId: string) {
    const favs = this.getFavorites();
    const index = favs.indexOf(toolPathOrId);
    let updated: string[];
    if (index >= 0) {
      updated = favs.filter((item) => item !== toolPathOrId);
    } else {
      updated = [...favs, toolPathOrId];
    }
    setStoredJson(FAVORITES_KEY, updated);
  },
};

export function useUserTools() {
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() =>
    userToolsStore.getRecentTools()
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    userToolsStore.getFavorites()
  );

  useEffect(() => {
    const sync = () => {
      setRecentTools(userToolsStore.getRecentTools());
      setFavorites(userToolsStore.getFavorites());
    };
    window.addEventListener("dailytools_storage_update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("dailytools_storage_update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const getFavoriteToolsData = (): Tool[] => {
    const all = getAllTools();
    return all.filter((t) => favorites.includes(t.path) || favorites.includes(t.id));
  };

  return {
    recentTools,
    favorites,
    favoriteTools: getFavoriteToolsData(),
    addRecentTool: (tool: { id: string; path: string; name: string; category?: string }) =>
      userToolsStore.addRecentTool(tool),
    clearRecentTools: () => userToolsStore.clearRecentTools(),
    toggleFavorite: (idOrPath: string) => userToolsStore.toggleFavorite(idOrPath),
    isFavorite: (idOrPath: string) => favorites.includes(idOrPath),
  };
}
