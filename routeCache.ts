import { CompressedRoute } from '../../types/route';

export class RouteCache {
    private cache: Map<string, {
        route: CompressedRoute;
        timestamp: number;
    }>;
    private readonly MAX_CACHE_SIZE = 100;
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    constructor() {
        this.cache = new Map();
    }

    set(key: string, route: CompressedRoute): void {
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            this.evictOldest();
        }

        this.cache.set(key, {
            route,
            timestamp: Date.now()
        });
    }

    get(key: string): CompressedRoute | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return cached.route;
    }

    private evictOldest(): void {
        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        for (const [key, value] of this.cache.entries()) {
            if (value.timestamp < oldestTime) {
                oldestTime = value.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }
} 