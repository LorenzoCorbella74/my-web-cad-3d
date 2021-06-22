export default class KeyboardEvents {

    constructor(main) {

        this.main = main;
        
        this.currentCommand = 'CREATE'  // DEFAULTS

        this.startListenDocumentKeyup()
    }

    startListenDocumentKeyup () {
        document.onkeyup = (e) => {
            if (e.key == 'Escape' || e.key == 'c') {
                this.currentCommand = 'CREATE';
            } else if (e.key == 'e') {
                this.currentCommand = 'EDIT';
            } else if (e.key == 'd') {
                this.currentCommand = 'DELETE';
            
            } else if (e.key == '1') {
                this.main.gridSize = 64
                this.main.createGrid(this.main.gridSize)
            } else if (e.key == '2') {
                this.main.gridSize = 32
                this.main.createGrid(this.main.gridSize)
            } else if (e.key == '3') {
                this.main.gridSize = 16
                this.main.createGrid(this.main.gridSize)
            } else if (e.key == '4') {
                this.main.gridSize = 8
                this.main.createGrid(this.main.gridSize)
            }
        }
    }
}