import { RouteCache } from '../services/cache/routeCache';
import { CompressedRoute } from '../types/route';

describe('RouteCache', () => {
    let cache: RouteCache;

    beforeEach(() => {
        cache = new RouteCache();
    });

    it('should store and retrieve routes', () => {
        const mockRoute: CompressedRoute = {
            points: new Uint8Array([1, 2, 3]),
            metadata: {
                distance: 10,
                duration: 300,
                bounds: {
                    minLat: 0,
                    maxLat: 1,
                    minLng: 0,
                    maxLng: 1
                }
            }
        };

        cache.set('test-route', mockRoute);
        const retrieved = cache.get('test-route');
        expect(retrieved).toEqual(mockRoute);
    });

    it('should evict oldest entries when cache is full', () => {
        const mockRoute = (i: number): CompressedRoute => ({
            points: new Uint8Array([i]),
            metadata: {
                distance: 10,
                duration: 300,
                bounds: {
                    minLat: 0,
                    maxLat: 1,
                    minLng: 0,
                    maxLng: 1
                }
            }
        });

        // Fill cache beyond capacity
        for (let i = 0; i < 101; i++) {
            cache.set(`route-${i}`, mockRoute(i));
        }

        // First entry should be evicted
        expect(cache.get('route-0')).toBeNull();
        // Latest entry should exist
        expect(cache.get('route-100')).toBeTruthy();
    });
}); 