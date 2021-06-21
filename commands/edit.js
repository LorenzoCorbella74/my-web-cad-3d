import Command from './command';
import { Raycaster } from 'three'

export default class EditCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
    }

    mousemove (e) {
        console.log('Command: mousemove edit', e, this)
    }

    pointerdown (e) {
        console.log('Command: pointerdown edit', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
           
        }
        // this.main.render();
    }

    pointerup (event) {
        console.log('Command: pointerup edit', event, this)
    }
}