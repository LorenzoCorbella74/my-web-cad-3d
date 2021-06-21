import Command from './command';
import { Raycaster } from 'three'

export default class CreateCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
    }

    mousemove (e) {
        console.log('Command: mousemove delete', e, this)
    }

    pointerdown (e) {
        console.log('Command: pointerdown delete', e, this)
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
        console.log('Command: pointerup delete', event, this)
    }
}