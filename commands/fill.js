import Command from './command';
import { Raycaster } from 'three'

export default class FillCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
        this.intersected = null;
    }

    hide (obj) {
        if (obj.userData.shape === 'cube') {
            [0, 1, 2, 3, 4, 5].forEach(face => {
                obj.material[face].opacity = 0.5;
                obj.material[face].transparent = true;
            });
        } else {
            obj.material.opacity = 0.5;
            obj.material.transparent = true;
        }
    }

    show (obj) {
        if (obj.userData.shape === 'cube') {
            [0, 1, 2, 3, 4, 5].forEach(face => {
                obj.material[face].opacity = 1;
                obj.material[face].transparent = false;
            });
        }
        else {
            obj.material.opacity = 1;
            obj.material.transparent = false;
        }
    }

    fill (obj) {
        if (obj.object.userData.shape === 'cube') {
            [0, 1, 2, 3, 4, 5].forEach(face => {
                obj.object.material[face].color.setStyle(this.main.colorsPanel.selectedColor)
            });
        }
        else {
            obj.object.material.color.setStyle(this.main.colorsPanel.selectedColor)
        }
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
            this.main.cursor.show('Fill color', e)

        } else {
            if (this.intersected) {
                this.show(this.intersected)
            }
            this.intersected = null;
            this.main.cursor.hide()
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
                this.fill(intersect)
            }
        }
        // this.main.render();
    }

    pointerup (event) {
        // console.log('Command: pointerup fill', event, this)
    }
}