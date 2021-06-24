import Stats from 'stats.js'
import * as dat from "dat.gui";


export const parameters = {
    background: 0x373232,
    ambientLight: 0x606060,
    directionalLight:0xffffff
}

export default class Debug {

    constructor(world) {

        this.world = world
        this.stats = new Stats()
        this.stats.showPanel(0); //2: mb, 1: ms, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.gui = new dat.GUI();

        let renderer = this.gui.addFolder("Renderer");
        renderer.add(this.world, "startLoop").name('Run loop');
        renderer.add(this.world, "stopLoop").name('Stop loop');
        renderer.addColor(parameters, "background").onChange((color) => {
            this.world.scene.background.set(color)
        });
        renderer.open();
        
        let ambientLight = this.gui.addFolder('Ambient Light')
        ambientLight.addColor(parameters, "ambientLight").onChange((color) => {
            this.world.ambientLight.color.set(color)
        });

        let light = this.gui.addFolder("Directional Light");
        light.add(this.world.directionalLight.position, "x", 0, 100).name('X').listen();
        light.add(this.world.directionalLight.position, "y", 0, 100).name('Y').listen();
        light.add(this.world.directionalLight.position, "z", 0, 100).name('Z').listen();
        light.addColor(parameters, "directionalLight").onChange((color) => {
            this.world.directionalLight.color.set(color)
        });
        
        this.gui.close();
    }
}