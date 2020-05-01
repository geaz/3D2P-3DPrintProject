import { Box3, Geometry, BufferGeometry } from 'three';
export declare class Dimensions {
    geometry: Geometry | BufferGeometry;
    x: number;
    y: number;
    z: number;
    box: Box3;
    constructor(geometry: Geometry | BufferGeometry);
    getOriginCorrection(): {
        x: number;
        y: number;
        z: number;
    };
    get MaxDimension(): number;
}
