export interface RawRoute {
    points: Array<{
        lat: number;
        lng: number;
        elevation?: number;
        timestamp?: number;
    }>;
    metadata: {
        distance: number;
        duration: number;
        startPoint: string;
        endPoint: string;
    };
}

export interface CompressedRoute {
    points: Uint8Array; // Protocol Buffer encoded points
    metadata: {
        distance: number;
        duration: number;
        bounds: {
            minLat: number;
            maxLat: number;
            minLng: number;
            maxLng: number;
        };
    };
} 