class Playlist extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this._elements = [];
  }

  get shadow() {
    // eslint-disable-next-line no-underscore-dangle
    return this._shadow;
  }

  set shadow(val) {
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = val;
  }
  get elements() {
    // eslint-disable-next-line no-underscore-dangle
    return JSON.parse(this._elements);
  }


  static get observedAttributes() {
    return ['elements'];
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

  updateElements(val) {
    console.log(val)
    val = JSON.parse(val)
    let container = this.shadow.querySelector('#elements')
    container.innerHTML = ''

    for (let i = 0; i < val.length; i++) {
      let item = document.createElement('li');
      let element = val[i];
      let HTMLelement = `<img src="${element.thumb}" alt=""><div class="title">${element.title} - ${element.subtitle} </div>`
      item.innerHTML = HTMLelement;
      container.appendChild(item)
    }
  }

  updateAttributes(elements) {
    let elementos = JSON.stringify(elements)
    this.setAttribute('elements', elementos)
    console.log(elements)
  }

  connectedCallback() {
    let template;
    fetch('/components/Playlist/template.html', {
      method: 'GET',
    }).then((response) => {
      response.text().then((data) => {
        template = data;
        this.shadow.innerHTML = template;
      });
    });
  }
}
window.customElements.define('play-list', Playlist);
