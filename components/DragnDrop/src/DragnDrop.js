class DragnDrop extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this._size = undefined;
    this._border = undefined;
    this.callbackConfig.bind(this)
  }

  get shadow() {
    // eslint-disable-next-line no-underscore-dangle
    return this._shadow;
  }

  set shadow(val) {
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = val;
  }
  get size() {
    // eslint-disable-next-line no-underscore-dangle
    return this._size;
  }

  set size(val) {
    // eslint-disable-next-line no-underscore-dangle
    this.setAttribute('size', val);
  }
  get border() {
    // eslint-disable-next-line no-underscore-dangle
    return this._border;
  }

  set border(val) {
    // eslint-disable-next-line no-underscore-dangle
    this.setAttribute('border', val);
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
    const size = val.split('x')
    const width = size[0]
    const height = size[1]
    console.log(width)
    this.shadow.querySelector('#drop_area').style.width = `${width}px`;
    this.shadow.querySelector('#drop_area').style.height = `${height}px`;
    // this.shadow.querySelector('#drop_area').innerHTML = height;
    console.log('New size')
  }

  updateBorder(val) {

    if (val == "true") {
      console.log('NewBorder')
      this.shadow.querySelector('#drop_area').classList.add('border');
    } else {
      this.shadow.querySelector('#drop_area').classList.remove('border');
    }
  }



  addEvents() {
    let area = this.shadow.querySelector('#drop_area')
    const self = this;

    area.addEventListener('drop', function (ev) {
      ev.preventDefault();
      this.style.background = '#576574'
      let files = ev.dataTransfer.files;
      console.log(files[0])


      let reader = new FileReader();
      if (files[0].type == "application/json") {
        $setting.style.display = "flex"
        let data;
        reader.onloadend = function () {
          data = JSON.parse(this.result);
          updateComponents(data)
        };

        reader.readAsText(ev.dataTransfer.files[0]);
      } else {
        console.log('El archivo de configuración debe ser un JSON')
      }
    });

    area.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      this.style.background = '#fbc531'
    });
    area.addEventListener('dragleave', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      this.style.background = '#576574'
    });
    area.setAttribute('draggable', 'true')
  }

  updateAttributes({ size, border }) {
    this.size = size;
    this.border = border;
  }

  callbackConfig(data) {
    console.log(data.dropArea.size)
    this.size = data.dropArea.size;
    this.border = data.dropArea.border;
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