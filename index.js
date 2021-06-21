import {
  Scene,
  Color,
  Mesh, Vector2,
  // MATERIALS
  MeshBasicMaterial,
  // LIGHTS
  AmbientLight, DirectionalLight,
  // GEOMETRIES
   PlaneBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  // HELPERS
  GridHelper
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Debug, { parameters } from './debug'
import KeyboardEvents from './keyboard'

import CreateCommand from './commands/create'
import DeleteCommand from './commands/delete'
import EditCommand from './commands/edit'

class WebEditor3D {

  constructor() {
    this.animate = this.animate.bind(this)
    this.objects = []
    this.init()
  }

  init () {

    // CAMERA
    this.aspect = window.innerWidth / window.innerHeight
    this.camera = new PerspectiveCamera(50, this.aspect, 1, 500)
    this.camera.position.set(60, 60, 60)
    this.camera.lookAt(0, 0, 0);

    // SCENE
    this.scene = new Scene()
    this.scene.background = new Color(parameters.background)
    this.scene.add(this.mesh)

    // GRID
    const size = 128;
    const divisions = 16;
    const gridHelper = new GridHelper(size, divisions, 0x888888, 0x444444);
    this.scene.add(gridHelper);

    // PLANE
    const geoPlane = new PlaneBufferGeometry(128, 128);
    const matPlane = new MeshBasicMaterial({
      color: 0x4d4444, /* , side: THREE.DoubleSide */
      opacity: 0.5,
      transparent: true
    });
    const plane = new Mesh(geoPlane, matPlane);
    this.scene.add(plane);
    plane.position.y = -0.005;
    plane.rotation.x = -Math.PI / 2;
    plane.name = "hidden_plane";
    plane.visible = true;
    this.objects.push(plane);

    // lights
    this.ambientLight = new AmbientLight(parameters.ambientLight);
    this.scene.add(this.ambientLight);

    this.directionalLight = new DirectionalLight(parameters.directionalLight);
    this.directionalLight.position.set(100, 75, 50);
    this.scene.add(this.directionalLight);

    // RENDERER
    this.renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)
    document.body.appendChild(this.renderer.domElement)

    // CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.mouse = new Vector2();

    this.KeyboardEvents = new KeyboardEvents(this)

    // Commands
    this.commands = {
      'CREATE': new CreateCommand(this),
      'DELETE': new DeleteCommand(this),
      'EDIT': new EditCommand(this)
    }

    // STATS + DAT.GUI
    this.debug = new Debug(this)

    // EVENTS
    this.startListening()
    // LOOP
    this.startLoop()
  }


  startListening () {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.oncontextmenu = () => false;
    window.addEventListener('mousemove', this.globalHandler.bind(this), false);
    window.addEventListener('pointerdown', this.globalHandler.bind(this), false);
    window.addEventListener('pointerup', this.globalHandler.bind(this), false);
  }

  globalHandler (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.mouse.set(
      (ev.clientX / window.innerWidth) * 2 - 1,
      -(ev.clientY / window.innerHeight) * 2 + 1
    );

    ev._x = this.mouse.x;
    ev._y = this.mouse.y;

    var func = this.commands[this.KeyboardEvents.currentCommand][ev.type].bind(this.commands[this.KeyboardEvents.currentCommand]);
    if (func) {
      func(ev, this);
    }
  }

  startLoop () {
    this.renderer.setAnimationLoop(this.animate)
  }
  stopLoop () {
    this.renderer.setAnimationLoop()
  }

  animate () {
    this.debug.stats.begin()

    this.controls.update()
    this.renderer.render(this.scene, this.camera)

    this.debug.stats.end()
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

new WebEditor3D()
