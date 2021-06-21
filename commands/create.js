import Command from './command';
import {
    BoxBufferGeometry, 
    MeshBasicMaterial, MeshLambertMaterial, Mesh,
    Raycaster
} from 'three'


export default class CreateCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
        this.cubeGeo = new BoxBufferGeometry(8, 8, 8);
        this.cubeMaterial = new MeshLambertMaterial({ color: 0xe1f4f3 });
        this.createTemporaryCube()
    }

    createTemporaryCube () {
        const rollOverGeo = new BoxBufferGeometry(8, 8, 8);
        const rollOverMaterial = new MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.5,
            transparent: true
        });
        this.rollOverMesh = new Mesh(rollOverGeo, rollOverMaterial);
        this.main.scene.add(this.rollOverMesh);
    }

    mousemove (e) {
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            this.rollOverMesh.position.divideScalar(8).floor().multiplyScalar(8).addScalar(4);
        }
        // this.main.render();
    }

    pointerdown (e) {
        console.log('Command: pointerdown', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            const voxel = new Mesh(this.cubeGeo, this.cubeMaterial);
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(8).floor().multiplyScalar(8).addScalar(4);
            this.main.scene.add(voxel);
            this.main.objects.push(voxel);
        }
        // this.main.render();
    }

    pointerup (event) {
        console.log('Command: pointerup', event, this)
    }
}