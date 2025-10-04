export class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly STORAGE_KEY = 'short_urls';

  private constructor() { }

  // Singleton getter
  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Ensure code only runs in the browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Retrieve all short URLs
  public get(): ShortUrl[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Add or update a short URL
  public push(shortUrl: string, destUrl: string): void {
    if (!this.isBrowser()) return;

    const urls = this.get();
    const now = new Date().toISOString();
    const existing = urls.find(u => u.shortUrl === shortUrl);

    if (existing) {
      existing.updated_at = now;
    } else {
      urls.push({
        shortUrl,
        destUrl,
        created_at: now,
        updated_at: now,
      });
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(urls));
  }

  // Update only updated_at for an existing short URL
  public editShortUrl(shortUrl: string): void {
    if (!this.isBrowser()) return;

    const urls = this.get();
    const now = new Date().toISOString();
    const index = urls.findIndex(u => u.shortUrl === shortUrl);

    if (index !== -1) {
      urls[index].updated_at = now;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(urls));
    }
  }

  // Remove a specific short URL
  public remove(shortUrl: string): void {
    if (!this.isBrowser()) return;
    const urls = this.get().filter(u => u.shortUrl !== shortUrl);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(urls));
  }

  // Clear all stored short URLs
  public clear(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
