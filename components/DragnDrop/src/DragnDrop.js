/* eslint-disable linebreak-style */
class DragnDrop extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this._size = undefined;
    this._border = undefined;
    this.callbackConfig.bind(this);
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
    return this._size;
  }

  set size(val) {
    this.setAttribute('size', val);
  }

  get border() {
    return this._border;
  }

  set border(val) {
    this.setAttribute('border', val);
  }

  static get observedAttributes() {
    return ['size', 'border'];
  }

  attributeChangedCallback(name, oldVal, newValue) {
    this[`update${name.charAt(0).toUpperCase() + name.slice(1)}`](newValue);
  }

  updateSize(val) {
    const size = val.split('x');
    const width = size[0];
    const height = size[1];
    this.shadow.querySelector('#drop_area').style.width = `${width}px`;
    this.shadow.querySelector('#drop_area').style.height = `${height}px`;
  }

  updateBorder(val) {

    if (val === 'true') {
      this.shadow.querySelector('#drop_area').classList.add('border');
    } else {
      this.shadow.querySelector('#drop_area').classList.remove('border');
    }
  }



  addEvents() {
    const area = this.shadow.querySelector('#drop_area');

    area.addEventListener('drop', function (ev) {
      ev.preventDefault();
      this.style.background = '#576574';
      const files = ev.dataTransfer.files;

      const reader = new FileReader();
      if (files[0].type === 'application/json') {
        $setting.style.display = 'flex';
        let data;
        reader.onloadend = function () {
          data = JSON.parse(this.result);
          updateComponents(data);
        };

        reader.readAsText(ev.dataTransfer.files[0]);
      } else {
        alert('El archivo de configuración debe ser un JSON');
      }
    });

    area.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      this.style.background = '#fbc531';
    });
    area.addEventListener('dragleave', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      this.style.background = '#576574';
    });
    area.setAttribute('draggable', 'true');
  }

  updateAttributes({ size, border }) {
    this.size = size;
    this.border = border;
  }

  callbackConfig(data) {
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