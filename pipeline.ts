import { RouteSimplifier } from './simplifyRoute';
import { ProtobufEncoder } from './protobufEncoder';
import { RouteCache } from '../cache/routeCache';
import { RawRoute, CompressedRoute } from '../../types/route';

export class CompressionPipeline {
    private simplifier: RouteSimplifier;
    private encoder: ProtobufEncoder;
    private cache: RouteCache;

    constructor() {
        this.simplifier = new RouteSimplifier();
        this.encoder = new ProtobufEncoder();
        this.cache = new RouteCache();
    }

    async processRoute(route: RawRoute, cacheKey: string): Promise<CompressedRoute> {
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        // Process route
        const simplified = this.simplifier.simplify(route);
        const compressed = await this.encoder.encode(simplified);

        // Cache result
        this.cache.set(cacheKey, compressed);

        return compressed;
    }
} 