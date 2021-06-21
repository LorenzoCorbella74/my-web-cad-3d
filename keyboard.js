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
                this.main.createGrid(64)
            } else if (e.key == '2') {
                this.main.createGrid(32)
            } else if (e.key == '3') {
                this.main.createGrid(16)
            } else if (e.key == '4') {
                this.main.createGrid(8)
            }
        }
    }
}