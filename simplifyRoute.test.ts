import { RouteSimplifier } from '../services/compression/simplifyRoute';
import { RawRoute } from '../types/route';

describe('RouteSimplifier', () => {
    const simplifier = new RouteSimplifier();

    it('should preserve start and end points', () => {
        const route: RawRoute = {
            points: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 1 },
                { lat: 2, lng: 2 }
            ],
            metadata: {
                distance: 10,
                duration: 300,
                startPoint: "Start",
                endPoint: "End"
            }
        };

        const simplified = simplifier.simplify(route);
        expect(simplified.points[0]).toEqual(route.points[0]);
        expect(simplified.points[simplified.points.length - 1])
            .toEqual(route.points[route.points.length - 1]);
    });

    it('should reduce number of points while maintaining shape', () => {
        const route: RawRoute = {
            points: Array.from({ length: 100 }, (_, i) => ({
                lat: i * 0.01,
                lng: i * 0.01
            })),
            metadata: {
                distance: 10,
                duration: 300,
                startPoint: "Start",
                endPoint: "End"
            }
        };

        const simplified = simplifier.simplify(route);
        expect(simplified.points.length).toBeLessThan(route.points.length);
    });
}); 