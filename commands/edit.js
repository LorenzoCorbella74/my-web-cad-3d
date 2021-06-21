import Command from './command';
import { Raycaster } from 'three'
import TWEEN from '@tweenjs/tween.js'

export default class EditCommand extends Command {

    constructor(state) {
        super(state)
        this.raycaster = new Raycaster();
    }

    mousemove (e) {
        // console.log('Command: mousemove edit', e, this)
        this.main.tempMesh.visible = false
    }

    pointerdown (e) {
        // console.log('Command: pointerdown edit', e, this)
        this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.main.objects);
        if (intersects.length > 0 && intersects[0].object.name !== 'hidden_plane') {
            let localNormal = intersects[0].face?.normal || { x: 0, y: 0, z: 0 };
            console.log(localNormal)
            let cube = intersects[0].object;
            if (cube.userData.moveOngoing || cube.userData.scaleOngoing) return
            if (localNormal.x) {
                let scale = new TWEEN.Tween(cube.scale).to({
                    x: cube.scale.x + 1,
                    y: cube.scale.y,
                    z: cube.scale.z
                }, 250)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.scaleOngoing = true;
                    }).onComplete(() => {
                        cube.userData.scaleOngoing = false;
                    })
                let move = new TWEEN.Tween(cube.position).to({
                    x: cube.position.x + localNormal.x * 4,
                    y: cube.position.y,
                    z: cube.position.z
                }, 251)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.moveOngoing = true;
                    })
                    .onComplete(() => {
                        cube.userData.moveOngoing = false;
                    })
                scale.start()
                move.start()
            }
            if (localNormal.y) {
                let scale = new TWEEN.Tween(cube.scale).to({
                    x: cube.scale.x,
                    y: cube.scale.y + 1,
                    z: cube.scale.z
                }, 250)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.scaleOngoing = true;
                    }).onComplete(() => {
                        cube.userData.scaleOngoing = false;
                    })
                let move = new TWEEN.Tween(cube.position).to({
                    x: cube.position.x,
                    y: cube.position.y + localNormal.y * 4,
                    z: cube.position.z
                }, 251)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.moveOngoing = true;
                    })
                    .onComplete(() => {
                        cube.userData.moveOngoing = false;
                    })
                scale.start()
                move.start()
            }
            if (localNormal.z) {
                let scale = new TWEEN.Tween(cube.scale).to({
                    x: cube.scale.x,
                    y: cube.scale.y,
                    z: cube.scale.z + 1
                }, 250)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.scaleOngoing = true;
                    }).onComplete(() => {
                        cube.userData.scaleOngoing = false;
                    })
                let move = new TWEEN.Tween(cube.position).to({
                    x: cube.position.x,
                    y: cube.position.y,
                    z: cube.position.z + localNormal.z * 4
                }, 251)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onStart(() => {
                        cube.userData.moveOngoing = true;
                    })
                    .onComplete(() => {
                        cube.userData.moveOngoing = false;
                    })
                scale.start()
                move.start()
            }
        }
        // this.main.render();
    }

    pointerup (event) {
        // console.log('Command: pointerup edit', event, this)
    }
}