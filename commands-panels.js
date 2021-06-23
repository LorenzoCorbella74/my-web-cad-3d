export const COLORS_CMD_PANEL = [
    // NAVY
    '#001f3f',
    // Blue
    '#0074D9',
    // AQUA
    '#7FDBFF',
    // TEAL
    '#39CCCC',
    // OLIVE
    '#3D9970',
    // GREEN
    '#2ECC40',
    // LIME
    '#01FF70',
    // YELLOW
    '#FFDC00',
    // ORANGE
    '#FF851B',
    // BROWN
    '#8B4513',
    // RED
    '#FF4136',
    // MAROON
    '#85144b',
    // FUCHSIA
    '#F012BE',
    // PURPLE
    '#B10DC9',
    // BLACK-
    '#111111',
    // GRAY
    '#AAAAAA',
    // SILVER
    '#DDDDDD'
];

export default class CommandsPanel {
    constructor(app) {

        this.main = app
        
        this.colors = document.querySelector('.colors');

        this.generateColors();

        this.adjustColorSelection(this.main.selectedColorInPanel)

        // EVENTS

        // EVENTS from USER SELECTION
        document.body.addEventListener('SELECT-ITEM', (passed) => {
            console.log(`Selected element: ${passed.detail}`);
            if (passed.detail || passed.detail == 0) {
                // this.main.selectedColorInPanel = 'todo';
                // this.adjustColorSelection(this.main.selectedColorInPanel)
            }
        }, true);

    }

    // http://clrs.cc/
    generateColors () {
        let li = COLORS_CMD_PANEL;
        this.colors.innerHTML = '<ul>' + li.map((e) => `<li class="color-dot" data-color="${e}" style="background-color:${e}"></li>`)
            .join('') + '</ul>';
        this.colors.addEventListener('click', this.selectColor.bind(this))
    }

    selectColor (evt) {
        let c = evt.target.dataset.color;
        this.main.selectedColorInPanel = c;
        this.adjustColorSelection(c);
    }

    adjustColorSelection (c) {
        let items = this.colors.getElementsByTagName("li");
        for (let i = 0; i < items.length; ++i) {
            items[i].classList.remove('selected-color');
            if (items[i].dataset.color === c) {
                items[i].classList.add('selected-color');
            }
        }
        // TODO
        /* if (this.main.selected || this.main.selected == 0) {
            this.main.shapes[this.main.selected].color = this.main.selectedColorInPanel;
        } */
    }


    click (e) {
        console.log(`Event from commands panel: ${e.target.dataset.cmd}`);
    }

    
    import () {
        let input = document.getElementById('file-input');
        input.onchange = e => {
            // getting a hold of the file reference
            var file = e.target.files[0];
            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                var content = readerEvent.target.result; // this is the content!
                try {
                    this.createDrawingFromImportedFile(JSON.parse(content));
                } catch (error) {
                    console.log('Was not possible to import the file!')
                }
            }
        }
        input.click();
    }

    save () {
        let date = new Date()
        let output = {
            ver: APP_VERSION,
            date: date.toTimeString(),
            shapes: this.main.HM.value,
            theme: this.main.selectedTheme
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `draw_${date.toTimeString()}.json`); // ``
        dlAnchorElem.click();
    }

    createDrawingFromImportedFile (data) {
        console.log('data :>> ', data);
    }

}