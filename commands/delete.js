import Command from './command';
import { Raycaster } from 'three'

export default class CreateCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
        this.intersected = null;
    }

    mousemove (e) {
        // console.log('Command: mousemove delete', e, this)
        this.main.tempMesh.visible = false
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);

        let intersects = this.raycaster.intersectObjects(this.main.objects);

        if (intersects.length > 0 && intersects[0].object.name !== 'hidden_plane') {
            if (this.intersected != intersects[0].object) {
                if (this.intersected) {
                    // this.intersected.material.color.setHex(this.intersected.currentHex);
                    this.intersected.material.opacity = 1;
                    this.intersected.material.transparent = false;
                }
                this.intersected = intersects[0].object;
                this.intersected.currentHex = this.intersected.material.color.getHex();
                // this.intersected.material.color.setHex( 0xff0000);
                this.intersected.material.opacity = 0.5;
                this.intersected.material.transparent = true;
            }
        } else {
            if (this.intersected) {
                // this.intersected.material.color.setHex(this.intersected.currentHex);
                this.intersected.material.opacity = 1;
                this.intersected.material.transparent = false;
            }
            this.intersected = null;
        }
    }

    pointerdown (e) {
        // console.log('Command: pointerdown delete', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            if (intersect.object.name !== 'hidden_plane') {
                this.main.scene.remove(intersect.object);
                this.main.objects.splice(this.main.objects.indexOf(intersect.object), 1);
            }
        }
        // this.main.render();
    }

    pointerup (event) {
        // console.log('Command: pointerup delete', event, this)
    }
}