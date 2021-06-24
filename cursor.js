export default class Cursor {

    constructor() {
        this.cursor = document.getElementById('cursor');
    }

    show (message = '', evt) {
        this.cursor.innerHTML = message // '&#128204;';
        this.cursor.style.visibility = 'visible';
        this.cursor.style.top = evt.clientY + 'px';
        this.cursor.style.left = evt.clientX + 18 + 'px';
    }

    hide () {
        this.cursor.style.visibility = 'hidden';
    }

}