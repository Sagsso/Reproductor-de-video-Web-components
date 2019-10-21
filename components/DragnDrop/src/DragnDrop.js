class DragnDrop extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this.size = undefined;
    this.border = undefined;

  }

  get shadow() {
    // eslint-disable-next-line no-underscore-dangle
    return this._shadow;
  }

  set shadow(val) {
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = val;
  }

  static get observedAttributes() {
    return ['size', 'border'];
  }

  /**
     * attributeChangedCallback
     *
     * Se ejecuta cuando el valor de cualquier atributo declarado dentro del arreglo de los
     * observedAttributes cambia.
     *
     * @param {string} name nombre del atributo que cambia
     * @param {mixed} oldVal valor anterior del atributo
     * @param {mixed} newValue nuevo valor del atributo
     */
  attributeChangedCallback(name, oldVal, newValue) {
    this[`update${name.charAt(0).toUpperCase() + name.slice(1)}`](newValue);
  }

  updateSize(val) {
    this.shadow.querySelector('#size').innerHTML = val;
  }

  updateBorder(val) {
    this.shadow.querySelector('#border').innerHTML = val;
  }
  alloowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    let area = this.shadow.querySelector('#drop_area')
    area.style.background = red;
  }
  dropFiles(ev) {
    ev.preventDefault();
    let files = ev.dataTransfer.files;
    console.log(files)
  }

  addEvents() {
    let area = this.shadow.querySelector('#drop_area')

    area.addEventListener('drop', function (ev) {
      ev.preventDefault();
      let files = ev.dataTransfer.files;
      console.log(files)
    });

    area.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      area.style.background = 'red';
    });
    area.setAttribute('draggable', 'true')
  }
  connectedCallback() {
    let template;
    fetch('/components/DragnDrop/template.html', {
      method: 'GET',
    }).then((response) => {
      response.text().then((data) => {
        template = data;
        this.shadow.innerHTML = template;
        this.addEvents();
      });
    });
  }
}
window.customElements.define('dragn-drop', DragnDrop);