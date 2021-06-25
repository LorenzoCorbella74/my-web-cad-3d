import Command from './command';
import {
  // GEOMETRY
  BoxBufferGeometry, CylinderBufferGeometry,
  // MATERIAL
  MeshBasicMaterial, MeshLambertMaterial, Mesh,
  Raycaster,
  // HELPERS
  AxesHelper
} from 'three'

export default class CreateCommand extends Command {

  constructor(state) {
    super(state)
    this.raycaster = new Raycaster();
    this.createTemporaryMeshes()
  }

  get size () {
    return this.main.gridSize / this.main.gridDiv
  }

  createTemporaryMeshes () {
    const geometryHC = this.createTempHalfCilinder();
    const geometryQC = this.createTempQuarterCylinder();
    const geometryCube = new BoxBufferGeometry(this.size, this.size, this.size);

    const material = new MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.15,
      transparent: true,
      /* wireframe:true */
    });
    const cube = new Mesh(geometryCube, material)
    cube.userData.shape = 'temp-cube';
    const halfCylinder = new Mesh(geometryHC, material)
    halfCylinder.userData.shape = 'temp-cube';
    const quarterCylinder = new Mesh(geometryQC, material)
    quarterCylinder.userData.shape = 'temp-cube';

    this.tempMeshes = {
      'cube': cube,
      'half-cylinder': halfCylinder,
      'quarter-cylinder': quarterCylinder,
    }
    this.main.tempMesh = this.tempMeshes['cube'].clone(); // default mesh is cube
    this.main.scene.add(this.main.tempMesh);
  }

  createTempQuarterCylinder () {
    const radiusTop = this.size;
    const radiusBottom = this.size;
    const height = this.size;
    const radialSegments = 12;
    const heightSegments = 2;
    const openEnded = false;
    const thetaStart = Math.PI * 0.00;
    const thetaLength = Math.PI * 0.5;

    const geometry = new CylinderBufferGeometry(
      radiusTop, radiusBottom, height,
      radialSegments, heightSegments,
      openEnded,
      thetaStart, thetaLength);
    return geometry;
  }

  createTempHalfCilinder () {
    const radiusTop = this.size / 2;
    const radiusBottom = this.size / 2;
    const height = this.size;
    const radialSegments = 12;
    const heightSegments = 2;
    const openEnded = false;
    const thetaStart = Math.PI * 0.00;
    const thetaLength = Math.PI * 1.00;

    const geometry = new CylinderBufferGeometry(
      radiusTop, radiusBottom, height,
      radialSegments, heightSegments,
      openEnded,
      thetaStart, thetaLength);
    return geometry;
  }

  mousemove (e) {
    this.main.tempMesh.visible = true;
    this.main.tempMesh.scale.set(this.size / 8, this.size / 8, this.size / 8,)

    this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
    // calculate objects intersecting the picking ray
    let intersects = this.raycaster.intersectObjects(this.main.objects);
    if (intersects.length > 0) {
      let intersect = intersects[0];

      this.main.tempMesh.geometry.dispose()
      this.main.tempMesh.geometry = this.tempMeshes[this.main.currentShape].geometry.clone()
      // this.main.tempMesh.geometry.buffersNeedUpdate = true
      // this.main.tempMesh.geometry.verticesNeedUpdate = true
      // this.main.tempMesh.geometry.needsUpdate = true
      // this.main.tempMesh.geometry.attributes.position.needsUpdate = true;
      // this.main.tempMesh.geometry.attributes.normal.needsUpdate = true;
      // this.main.tempMesh.geometry.attributes.uv.needsUpdate = true;

      this.main.tempMesh.position.copy(intersect.point).add(intersect.face.normal);
      this.main.tempMesh.position.divideScalar(this.size).floor().multiplyScalar(this.size).addScalar(this.size / 2);

      if (this.main.currentShape === 'half-cylinder') {
        this.main.tempMesh.translateX(-this.size / 2)

      }
      if (this.main.currentShape === 'quarter-cylinder') {
        this.main.tempMesh.translateX(-this.size / 2)
        this.main.tempMesh.translateZ(-this.size / 2)
      }

      this.main.cursor.show(`Create ${this.main.currentShape}`, e) // '&#128204;'
    } else {
      this.main.tempMesh.visible = false;
      this.main.cursor.hide()
    }
    // this.main.render();
  }

  click (e) {
    console.log('Command: click', e, this)
    if (e.ctrlKey) {
      this.raycaster.setFromCamera(this.main.mouse, this.main.camera);
      // calculate objects intersecting the picking ray
      let intersects = this.raycaster.intersectObjects(this.main.objects);
      if (intersects.length > 0) {
        let intersect = intersects[0];
        this.createFasade(intersect, this.size)
      }
      // this.main.render();
    }
  }

  createFasade (intersect, size) {
    let mesh
    if (this.main.currentShape === 'cube') {
      mesh = this.createBox(intersect, this.size);
    }
    if (this.main.currentShape === 'half-cylinder') {
      mesh = this.createHalfCilinder(intersect, this.size);
    }
    if (this.main.currentShape === 'quarter-cylinder') {
      mesh = this.createQuarterCilinder(intersect, this.size);
    }
    this.main.scene.add(mesh);
    this.main.objects.push(mesh);
  }

  createHalfCilinder (intersect, size) {
    const radiusTop = this.size / 2;
    const radiusBottom = this.size / 2;
    const height = this.size;
    const radialSegments = 12;
    const heightSegments = 2;
    const openEnded = false;
    const thetaStart = Math.PI * 0.00;
    const thetaLength = Math.PI * 1.00;

    const geometry = new CylinderBufferGeometry(
      radiusTop, radiusBottom, height,
      radialSegments, heightSegments,
      openEnded,
      thetaStart, thetaLength);
    const material = new MeshLambertMaterial({ color: this.main.colorsPanel.selectedColor })

    const mesh = new Mesh(geometry, material);
    mesh.position.copy(intersect.point).add(intersect.face.normal);
    mesh.position.divideScalar(size).floor().multiplyScalar(size).addScalar(size / 2);
    mesh.userData.shape = 'half-cylinder';
    mesh.translateX(-this.size / 2)
    const axesHelper = new AxesHelper(this.size * 2);
    axesHelper.visible = false
    mesh.add(axesHelper);
    return mesh;
  }


  createQuarterCilinder (intersect, size) {
    const radiusTop = this.size;
    const radiusBottom = this.size;
    const height = this.size;
    const radialSegments = 12;
    const heightSegments = 2;
    const openEnded = false;
    const thetaStart = Math.PI * 0.00;
    const thetaLength = Math.PI * 0.5;

    const geometry = new CylinderBufferGeometry(
      radiusTop, radiusBottom, height,
      radialSegments, heightSegments,
      openEnded,
      thetaStart, thetaLength);
    const material = new MeshLambertMaterial({ color: this.main.colorsPanel.selectedColor })

    const mesh = new Mesh(geometry, material);
    mesh.position.copy(intersect.point).add(intersect.face.normal);
    mesh.position.divideScalar(size).floor().multiplyScalar(size).addScalar(size / 2);
    mesh.userData.shape = 'quarter-cylinder';
    mesh.translateX(-this.size / 2)
    mesh.translateZ(-this.size / 2)
    const axesHelper = new AxesHelper(this.size * 2);
    axesHelper.visible = false
    mesh.add(axesHelper);
    return mesh;
  }

  createBox (intersect, size) {
    const cubeGeo = new BoxBufferGeometry(size, size, size);
    const materials = [
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      }),
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      }),
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      }),
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      }),
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      }),
      new MeshLambertMaterial({
        color: this.main.colorsPanel.selectedColor
      })
    ];
    /*  cubeGeo.castShadow = true
     cubeGeo.receiveShadow = true */
    const mesh = new Mesh(cubeGeo, materials);
    mesh.position.copy(intersect.point).add(intersect.face.normal);
    mesh.position.divideScalar(size).floor().multiplyScalar(size).addScalar(size / 2);
    mesh.userData.shape = 'cube';
    const axesHelper = new AxesHelper(this.size * 2);
    axesHelper.visible = false
    mesh.add(axesHelper);
    return mesh;
  }

  pointerup (event) {
    console.log('Command: pointerup', event, this)
  }
}