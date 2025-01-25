import { RawRoute } from '../../types/route';

export class RouteSimplifier {
    // Douglas-Peucker algorithm for polyline simplification
    private readonly TOLERANCE = 0.00001; // roughly 1 meter

    simplify(route: RawRoute): RawRoute {
        const points = route.points;
        if (points.length <= 2) return route;

        const markers = new Array(points.length).fill(false);
        markers[0] = markers[points.length - 1] = true;

        this.simplifyStep(points, 0, points.length - 1, markers);

        const simplifiedPoints = points.filter((_, i) => markers[i]);

        return {
            ...route,
            points: simplifiedPoints
        };
    }

    private simplifyStep(points: RawRoute['points'], first: number, last: number, markers: boolean[]): void {
        let maxDistance = 0;
        let maxIndex = 0;

        for (let i = first + 1; i < last; i++) {
            const distance = this.perpendicularDistance(
                points[i],
                points[first],
                points[last]
            );

            if (distance > maxDistance) {
                maxDistance = distance;
                maxIndex = i;
            }
        }

        if (maxDistance > this.TOLERANCE) {
            markers[maxIndex] = true;
            this.simplifyStep(points, first, maxIndex, markers);
            this.simplifyStep(points, maxIndex, last, markers);
        }
    }

    private perpendicularDistance(point: RawRoute['points'][0], lineStart: RawRoute['points'][0], lineEnd: RawRoute['points'][0]): number {
        // Calculate perpendicular distance from point to line
        const dx = lineEnd.lng - lineStart.lng;
        const dy = lineEnd.lat - lineStart.lat;
        
        const norm = Math.sqrt(dx * dx + dy * dy);
        return Math.abs(
            (dy * point.lng - dx * point.lat + lineEnd.lng * lineStart.lat - lineEnd.lat * lineStart.lng) / norm
        );
    }
} 