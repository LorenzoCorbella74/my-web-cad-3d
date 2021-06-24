export default class KeyboardEvents {

    constructor(main) {

        this.main = main;
        
        this.currentCommand = 'CREATE'  // DEFAULTS
        this.currentCommandDiv = document.getElementById('currentCommand');
        this.currentCommandDiv.innerHTML= this.currentCommand
        
        this.startListenDocumentKeyup()
    }

    startListenDocumentKeyup () {
        document.onkeyup = (e) => {
            if (e.key == 'Escape' || e.key == ' ') {
                this.currentCommand = 'CREATE';
            } else if (e.key == 'e') {
                this.currentCommand = 'EDIT';
            } else if (e.key == 'd') {
                this.currentCommand = 'DELETE';
            } else if (e.key == 'f') {
                this.currentCommand = 'FILL';
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
            this.currentCommandDiv.innerHTML= this.currentCommand
        }
    }

}