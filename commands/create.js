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
        this.createTemporaryCube()
    }

    get size(){
        return this.main.gridSize / this.main.gridDiv
    }

    createTemporaryCube () {
        const rollOverGeo = new BoxBufferGeometry(this.size, this.size, this.size);
        const rollOverMaterial = new MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.15,
            transparent: true,
            /* wireframe:true */
        });
        this.main.tempMesh = new Mesh(rollOverGeo, rollOverMaterial);
        this.main.scene.add(this.main.tempMesh);
    }

    mousemove (e) {
        this.main.tempMesh.visible = true;
        this.main.tempMesh.scale.set(this.size/8, this.size/8,this.size/8,)
        
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            this.main.tempMesh.position.copy(intersect.point).add(intersect.face.normal);
            this.main.tempMesh.position.divideScalar(this.size).floor().multiplyScalar(this.size).addScalar(this.size/2);
        } else {
            this.main.tempMesh.visible = false;
        }
        // this.main.render();
    }

    click (e) {
        console.log('Command: click', e, this)
        if(e.ctrlKey){
            this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
            // calculate objects intersecting the picking ray
            let intersects = this.raycaster.intersectObjects(this.main.objects);
            if (intersects.length > 0) {
                let intersect = intersects[0];
                const cubeGeo = new BoxBufferGeometry(this.size, this.size, this.size);
                const materials = [
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    }),
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    }),
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    }),
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    }),
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    }),
                    new MeshLambertMaterial({
                      color: this.main.selectedColorInPanel
                    })
                  ];
                const voxel = new Mesh(cubeGeo, materials);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(this.size).floor().multiplyScalar(this.size).addScalar(this.size/2);
                this.main.scene.add(voxel);
                this.main.objects.push(voxel);
            }
            // this.main.render();
        }
    }

    pointerup (event) {
        console.log('Command: pointerup', event, this)
    }
}