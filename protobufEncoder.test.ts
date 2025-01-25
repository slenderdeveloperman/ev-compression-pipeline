import { describe, it, expect } from '@jest/globals';
import { ProtobufEncoder } from '../services/compression/protobufEncoder';
import { RawRoute } from '../types/route';

describe('ProtobufEncoder', () => {
    const encoder = new ProtobufEncoder();

    it('should encode route data into binary format', async () => {
        const route: RawRoute = {
            points: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 1 }
            ],
            metadata: {
                distance: 10,
                duration: 300,
                startPoint: "Start",
                endPoint: "End"
            }
        };

        const compressed = await encoder.encode(route);
        expect(compressed.points).toBeInstanceOf(Uint8Array);
        expect(compressed.metadata.bounds).toBeDefined();
    });

    it('should calculate correct bounds', async () => {
        const route: RawRoute = {
            points: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 1 },
                { lat: -1, lng: 2 }
            ],
            metadata: {
                distance: 10,
                duration: 300,
                startPoint: "Start",
                endPoint: "End"
            }
        };

        const compressed = await encoder.encode(route);
        expect(compressed.metadata.bounds).toEqual({
            minLat: -1,
            maxLat: 1,
            minLng: 0,
            maxLng: 2
        });
    });
}); 