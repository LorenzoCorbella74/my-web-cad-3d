import Command from './command';
import { Raycaster } from 'three'

export default class FillCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
        this.intersected = null;
    }

    hide (obj) {
        [0, 1, 2, 3, 4, 5].forEach(face => {
            obj.material[face].opacity = 0.5;
            obj.material[face].transparent = true;
        });
    }

    show (obj) {
        [0, 1, 2, 3, 4, 5].forEach(face => {
            obj.material[face].opacity = 1;
            obj.material[face].transparent = false;
        });
    }

    mousemove (e) {
        // console.log('Command: mousemove delete', e, this)
        this.main.tempMesh.visible = false
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);

        let intersects = this.raycaster.intersectObjects(this.main.objects);

        if (intersects.length > 0 && intersects[0].object.name !== 'hidden_plane') {
            if (this.intersected != intersects[0].object) {
                if (this.intersected) {
                    this.show(this.intersected)
                }
                this.intersected = intersects[0].object;
                this.hide(this.intersected)
            }
            this.main.cursor.innerHTML = 'Fill color';
            this.main.cursor.style.visibility = 'visible';
            this.main.cursor.style.top = e.clientY + 'px';
            this.main.cursor.style.left = e.clientX + 18 + 'px';

        } else {
            if (this.intersected) {
                this.show(this.intersected)
            }
            this.intersected = null;
            this.main.cursor.style.visibility = 'hidden';
        }
    }

    click (e) {
        // console.log('Command: click fill', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            if (intersect.object.name !== 'hidden_plane') {
                [0, 1, 2, 3, 4, 5].forEach(face => {
                    intersect.object.material[face].color.setStyle(this.main.selectedColorInPanel)
                });  
            }
        }
        // this.main.render();
    }

    pointerup (event) {
        // console.log('Command: pointerup fill', event, this)
    }
}