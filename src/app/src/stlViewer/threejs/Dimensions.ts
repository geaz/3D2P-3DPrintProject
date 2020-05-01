import { Box3, Geometry, BufferGeometry } from "three";

export class Dimensions {
    public x: number;
    public y: number;
    public z: number;
    public box: Box3;

    constructor(public geometry: Geometry | BufferGeometry) {
        if (geometry.boundingBox === null) {
            geometry.computeBoundingBox();
        }
        let box = geometry.boundingBox;

        if (box === null) {
            throw "Error while getting bounding box of geometry!";
        }
        this.box = box;

        this.x = this.box.max.x - this.box.min.x;
        this.y = this.box.max.y - this.box.min.y;
        this.z = this.box.max.z - this.box.min.z;
    }

    public getOriginCorrection(): { x: number; y: number; z: number } {
        let originCorrection = (max: number, min: number) => (min - max) / 2 - min;
        return {
            x: originCorrection(this.box.max.x, this.box.min.x),
            y: originCorrection(this.box.max.y, this.box.min.y),
            z: originCorrection(this.box.max.z, this.box.min.z),
        };
    }

    get MaxDimension(): number {
        return Math.max(this.x, this.y, this.z);
    }
}
