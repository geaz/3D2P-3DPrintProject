import * as THREE from 'three';

export class Dimensions {
    public x: number;
    public y: number;
    public z: number;
    
    constructor(public box: THREE.Box3) {
        this.x = box.max.x - box.min.x;
        this.y = box.max.y - box.min.y;
        this.z = box.max.z - box.min.z;
    }

    public getOriginCorrection(): { x: number, y: number, z: number } {
        let originCorrection = (max, min) => ((min - max) / 2) - min;
        return {
            x: originCorrection(this.box.max.x, this.box.min.x),
            y: originCorrection(this.box.max.y, this.box.min.y),
            z: originCorrection(this.box.max.z, this.box.min.z)
        };
    }

    get MaxDimension(): number {
        return Math.max(this.x, this.y, this.z);
    }
}