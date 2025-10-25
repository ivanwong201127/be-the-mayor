import fs from 'fs';
import path from 'path';

export interface CacheEntry {
  url: string;
  timestamp: number;
  metadata?: any;
}

export interface CacheData {
  [key: string]: CacheEntry;
}

class LocalCache {
  private cacheDir: string;
  private cacheFile: string;

  constructor() {
    this.cacheDir = path.join(process.cwd(), 'cache');
    this.cacheFile = path.join(this.cacheDir, 'generated-content.json');
    this.ensureCacheDir();
  }

  private ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private readCache(): CacheData {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return {};
  }

  private writeCache(data: CacheData) {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  }

  get(key: string): CacheEntry | null {
    const cache = this.readCache();
    const entry = cache[key];
    
    if (entry) {
      // Check if cache is still valid (24 hours)
      const now = Date.now();
      const cacheAge = now - entry.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (cacheAge < maxAge) {
        return entry;
      } else {
        // Remove expired entry
        delete cache[key];
        this.writeCache(cache);
      }
    }
    
    return null;
  }

  set(key: string, url: string, metadata?: any) {
    const cache = this.readCache();
    cache[key] = {
      url,
      timestamp: Date.now(),
      metadata
    };
    this.writeCache(cache);
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  remove(key: string) {
    const cache = this.readCache();
    delete cache[key];
    this.writeCache(cache);
  }

  clear() {
    this.writeCache({});
  }

  getAll(): CacheData {
    return this.readCache();
  }
}

export const localCache = new LocalCache();
