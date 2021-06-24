import Command from './command';
import { Raycaster, Matrix3, Vector3 } from 'three'
import TWEEN from '@tweenjs/tween.js'

export default class EditCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
        this.activeFaceIndex = -1;
        this.intersected = null;
    }

    show (obj) {
        [0, 1, 2, 3, 4, 5].forEach(face => {
            obj.material[face].opacity = 1;
            obj.material[face].transparent = false;
        });
    }

    mousemove (e) {
        // console.log('Command: mousemove edit', e, this)
        this.main.tempMesh.visible = false
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        let intersects = this.raycaster.intersectObjects(this.main.objects);

        if (intersects.length > 0 && intersects[0].object.name !== 'hidden_plane') {
            if (intersects[0].face.materialIndex !== this.activeFaceIndex &&
                this.activeFaceIndex !== -1) {
                this.intersected.material[this.activeFaceIndex].opacity = 1;
                this.intersected.material[this.activeFaceIndex].transparent = false;
            }
            if (this.intersected && this.intersected != intersects[0].object) {
                this.show(this.intersected)
            }
            this.intersected = intersects[0].object;
            this.activeFaceIndex = intersects[0].face.materialIndex;
            this.intersected.material[this.activeFaceIndex].opacity = 0.5;
            this.intersected.material[this.activeFaceIndex].transparent = true;

            document.body.style.cursor = 'pointer';
            this.main.cursor.show(!e.ctrlKey ? 'Pull' : 'Push', e)  //'&#129307;' : '&#129308;';

        } else {
            if (this.intersected) {
                // si rimette il colore di default
                this.intersected.material[this.activeFaceIndex].opacity = 1;
                this.intersected.material[this.activeFaceIndex].transparent = false;
            }
            this.activeFaceIndex = -1;
            this.intersected = null

            this.main.cursor.hide()
            document.body.style.cursor = 'default';
        }
    }

    get size () {
        return this.main.gridSize / this.main.gridDiv
    }

    tweenTranslate (start, end, duration = 250, easing = TWEEN.Easing.Quadratic.InOut, obj) {
        let actualXpos = start.x;
        let actualYpos = start.y;
        let actualZpos = start.z;
        new TWEEN.Tween(start)
            .to(end, duration)
            .easing(easing)
            .onStart(() => {
                obj.userData.translateOngoing = true;
            })
            .onUpdate(function () {
                // Calculate the difference between current frame number and where we want to be:
                let differenceX = Math.abs(start.x - actualXpos);
                actualXpos = start.x;
                let differenceY = Math.abs(start.y - actualYpos);
                actualYpos = start.y;
                let differenceZ = Math.abs(start.z - actualZpos);
                actualZpos = start.z;
                // MOVE
                obj.translateX(+differenceX);
                obj.translateY(+differenceY);
                obj.translateZ(+differenceZ);
            })
            .onComplete(() => {
                obj.userData.translateOngoing = false;
            })
            .start()
    }
    
    tweenScale (start, end, duration = 250, easing = TWEEN.Easing.Quadratic.InOut, obj) {
        new TWEEN.Tween(start)
            .to(end, duration)
            .easing(easing)
            .onStart(() => {
                obj.userData.scaleOngoing = true;
            })
            .onComplete(() => {
                obj.userData.scaleOngoing = false;
            })
            .start()
    }

    click (e) {
        let addOrRemove = !e.ctrlKey ? 1 : -1

        let normalMatrix = new Matrix3();
        let worldNormal = new Vector3();

        console.log('Command: click edit', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0 && intersects[0].object.name !== 'hidden_plane') {
            let localNormal = intersects[0].face?.normal || { x: 0, y: 0, z: 0 };
            let cube = intersects[0].object;

            // https://stackoverflow.com/a/16280097
            normalMatrix.getNormalMatrix(cube.matrixWorld);
            worldNormal.copy(localNormal).applyMatrix3(normalMatrix).normalize();
            console.log('Local', localNormal, 'World', worldNormal)

            if (cube.userData.moveOngoing || cube.userData.scaleOngoing) return
            if (localNormal.x) {
                let scaleAmount = cube.scale.x + 1 * addOrRemove * (this.size) / cube.geometry.parameters.width
                this.tweenScale(cube.scale, {
                    x: scaleAmount == 0 ? 1 : scaleAmount,
                    y: cube.scale.y,
                    z: cube.scale.z
                }, 250, TWEEN.Easing.Elastic.Out, cube)
                if (scaleAmount !== 0) {
                    this.tweenTranslate(cube.position, {
                        x: cube.position.x + localNormal.x * this.size / 2 * addOrRemove,
                        y: cube.position.y,
                        z: cube.position.z
                    }, 251, TWEEN.Easing.Elastic.Out, cube)
                }

            }
            if (localNormal.y) {
                let scaleAmount = cube.scale.y + 1 * addOrRemove * (this.size) / cube.geometry.parameters.height
                this.tweenScale(cube.scale, {
                    x: cube.scale.x,
                    y: scaleAmount == 0 ? 1 : scaleAmount,
                    z: cube.scale.z
                }, 250, TWEEN.Easing.Elastic.Out, cube)
                if (scaleAmount !== 0) {
                    this.tweenTranslate(cube.position, {
                        x: cube.position.x,
                        y: cube.position.y + localNormal.y * this.size / 2 * addOrRemove,
                        z: cube.position.z
                    }, 251, TWEEN.Easing.Elastic.Out, cube)
                }
            }
            if (localNormal.z) {
                let scaleAmount = cube.scale.z + 1 * addOrRemove * (this.size) / cube.geometry.parameters.depth
                this.tweenScale(cube.scale, {
                    x: cube.scale.x,
                    y: cube.scale.y,
                    z: scaleAmount == 0 ? 1 : scaleAmount
                }, 250, TWEEN.Easing.Elastic.Out, cube)

                if (scaleAmount !== 0) {
                    this.tweenTranslate(cube.position, {
                        x: cube.position.x,
                        y: cube.position.y,
                        z: cube.position.z + localNormal.z * this.size / 2 * addOrRemove
                    }, 251, TWEEN.Easing.Elastic.Out, cube)
                }
            }
        }
        // this.main.render();
    }

    pointerup (event) {
        // console.log('Command: pointerup edit', event, this)
    }
}