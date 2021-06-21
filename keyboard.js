
export default class KeyboardEvents {

    constructor(main) {

        this.main = main;
        // DEFAULTS
        this.currentCommand = 'CREATE'

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
            }
        }
    }
}