import { Bulletin } from './schema';

export const SCHEMA_VERSION = 3;

const KEY = (date: string) => `bulletin-draft-v${SCHEMA_VERSION}-${date}`;

export const storage = {
  load(date: string): Bulletin | null {
    try {
      const raw = localStorage.getItem(KEY(date));
      if (!raw) return null;
      return Bulletin.parse(JSON.parse(raw));
    } catch {
      return null;
    }
  },
  save(b: Bulletin) {
    try {
      localStorage.setItem(KEY(b.date), JSON.stringify(b));
      return true;
    } catch {
      return false;
    }
  },
  clear(date: string) {
    localStorage.removeItem(KEY(date));
  },
  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('bulletin-draft-'))
      .forEach((k) => localStorage.removeItem(k));
  },
};