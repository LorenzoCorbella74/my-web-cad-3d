import Command from './command';
import { Raycaster, Matrix3, Vector3 } from 'three'
import TWEEN from '@tweenjs/tween.js'

export default class MoveCommand extends Command {

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
        new TWEEN.Tween(start)
            .to(end, duration)
            .easing(easing)
            .onStart(() => {
                obj.userData.translateOngoing = true;
            })
            .onComplete(() => {
                obj.userData.translateOngoing = false;
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

            // tutte e due pos
            if( (worldNormal.x > 0 && worldNormal.z > 0 )&& worldNormal.x > worldNormal.z){
                worldNormal.x = 1
                worldNormal.z = 0
            } else if ((worldNormal.x > 0 && worldNormal.z > 0 ) && worldNormal.x < worldNormal.z) {
                worldNormal.x = 0
                worldNormal.z = 1
            }
            // tutte e due pos
            if( (worldNormal.x < 0 && worldNormal.z < 0 )&& worldNormal.x < worldNormal.z){
                worldNormal.x = -1
                worldNormal.z = 0
            } else if ((worldNormal.x < 0 && worldNormal.z < 0 ) && worldNormal.z < worldNormal.x) {
                worldNormal.x = 0
                worldNormal.z = -1
            }

            if (cube.userData.moveOngoing ) return

            if (Math.floor(worldNormal.x)) {
                this.tweenTranslate(cube.position, {
                    x: cube.position.x + worldNormal.x * this.size * addOrRemove,
                    y: cube.position.y,
                    z: cube.position.z
                }, 250, TWEEN.Easing.Elastic.Out, cube)
            }
            if (Math.floor(worldNormal.y)) {
                this.tweenTranslate(cube.position, {
                    x: cube.position.x,
                    y: cube.position.y + worldNormal.y * this.size * addOrRemove,
                    z: cube.position.z
                }, 251, TWEEN.Easing.Elastic.Out, cube)
            }
            if (Math.floor(worldNormal.z)) {
                this.tweenTranslate(cube.position, {
                    x: cube.position.x,
                    y: cube.position.y,
                    z: cube.position.z + worldNormal.z * this.size * addOrRemove
                }, 251, TWEEN.Easing.Elastic.Out, cube)
            }
            
        }
        // this.main.render();
    }
}