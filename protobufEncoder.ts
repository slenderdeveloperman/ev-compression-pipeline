import * as protobuf from 'protobufjs';
import { RawRoute, CompressedRoute } from '../../types/route';

export class ProtobufEncoder {
    private routeProto: protobuf.Type;

    constructor() {
        // Load and compile proto file
        this.routeProto = protobuf.load('./src/proto/route.proto')
            .then(root => root.lookupType('route.Route'));
    }

    async encode(route: RawRoute): Promise<CompressedRoute> {
        const message = {
            points: route.points,
            metadata: route.metadata
        };

        // Verify the payload
        const errMsg = this.routeProto.verify(message);
        if (errMsg) throw Error(errMsg);

        // Create the binary buffer
        const buffer = this.routeProto.encode(message).finish();

        return {
            points: buffer,
            metadata: {
                distance: route.metadata.distance,
                duration: route.metadata.duration,
                bounds: this.calculateBounds(route.points)
            }
        };
    }

    private calculateBounds(points: RawRoute['points']) {
        return points.reduce((bounds, point) => ({
            minLat: Math.min(bounds.minLat, point.lat),
            maxLat: Math.max(bounds.maxLat, point.lat),
            minLng: Math.min(bounds.minLng, point.lng),
            maxLng: Math.max(bounds.maxLng, point.lng)
        }), {
            minLat: Infinity,
            maxLat: -Infinity,
            minLng: Infinity,
            maxLng: -Infinity
        });
    }
} 