export default class Command {

    constructor(main) {
        // ref to main class istance
        this.main = main;
    }

    mousemove(e) {
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;
    }

    click(e) {
        console.log('Command: click', e, this)
    }

    pointerup(event) {
        console.log('Command: pointerup', event, this)
    }
}