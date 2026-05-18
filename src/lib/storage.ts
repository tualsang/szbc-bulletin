import { Bulletin } from './schema';

const KEY = (date: string) => `bulletin-draft-${date}`;

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
};
