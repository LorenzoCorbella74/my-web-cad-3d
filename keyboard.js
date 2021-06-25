export default class KeyboardEvents {

    constructor(main) {

        this.main = main;

        this.shapes = ['cube', 'half-cylinder', 'quarter-cylinder']
        this.shapePosition = 0
        this.main.currentShape = 'cube'

        this.rotationAxes = ['x','y','z']
        this.rotationPosition = 0
        this.main.currentRotationAxe = 'x'

        this.currentCommand = 'CREATE'  // DEFAULTS
        this.currentCommandDiv = document.getElementById('currentCommand');
        this.currentCommandDiv.innerHTML = this.currentCommand

        this.startListenDocumentKeyup()
    }

    getNextShape () {
        this.shapePosition++
        if (this.shapePosition > this.shapes.length - 1) {
            this.shapePosition = 0
        }
        return this.shapes[this.shapePosition]
    }

    getNextRotation () {
        this.rotationPosition++
        if (this.rotationPosition > this.rotationAxes.length - 1) {
            this.rotationPosition = 0
        }
        return this.rotationAxes[this.rotationPosition]
    }

    startListenDocumentKeyup () {
        document.onkeyup = (e) => {
            if (e.key == 'Escape' || e.key == ' ') {
                this.main.currentShape = this.getNextShape()
                this.currentCommand = 'CREATE';
                console.log('Shape: ', this.main.currentShape)
            } else if (e.key == 'e') {
                this.currentCommand = 'EDIT';
            } else if (e.key == 'd') {
                this.currentCommand = 'DELETE';
            } else if (e.key == 'f') {
                this.currentCommand = 'FILL';
            } else if (e.key == 'r') {
                this.main.currentRotationAxe = this.getNextRotation()
                this.currentCommand = 'ROTATE';
            } else if (e.key == 'm') {
                this.currentCommand = 'MOVE';
            } else if (e.key == '1') {
                this.main.gridDiv = 128
                this.main.createGrid(this.main.gridDiv)
            } else if (e.key == '2') {
                this.main.gridDiv = 64
                this.main.createGrid(this.main.gridDiv)
            } else if (e.key == '3') { // default
                this.main.gridDiv = 32
                this.main.createGrid(this.main.gridDiv)
            } else if (e.key == '4') {
                this.main.gridDiv = 16
                this.main.createGrid(this.main.gridDiv)
            } else if (e.key == '5') {
                this.main.gridDiv = 8
                this.main.createGrid(this.main.gridDiv)
            }
            this.currentCommandDiv.innerHTML = this.currentCommand
        }
    }

}