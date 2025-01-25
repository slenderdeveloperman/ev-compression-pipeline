import { describe, it, expect } from '@jest/globals';
import { CompressionPipeline } from '../services/compression/pipeline';
import { RawRoute } from '../types/route';

describe('CompressionPipeline', () => {
    const pipeline = new CompressionPipeline();

    it('should process and cache routes', async () => {
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

        const result1 = await pipeline.processRoute(route, 'test-route');
        const result2 = await pipeline.processRoute(route, 'test-route');

        expect(result1).toEqual(result2); // Should return cached result
        expect(result1.points).toBeInstanceOf(Uint8Array);
    });
}); 