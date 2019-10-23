/* eslint-disable linebreak-style */
class Playlist extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this._elements = undefined;
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
    return this._elements;
  }

  set elements(elements) {
    // eslint-disable-next-line no-underscore-dangle
    this._elements = elements;
  }

  static get observedAttributes() {
    return ['elements'];
  }

  attributeChangedCallback(name, oldVal, newValue) {
    this[`update${name.charAt(0).toUpperCase() + name.slice(1)}`](newValue);
  }

  updateElements(val) {
    this.elements = val;
    const valJson = JSON.parse(val);
    const container = this.shadow.querySelector('#elements');
    container.innerHTML = '';

    for (let i = 0; i < valJson.length; i++) {
      const item = document.createElement('li');
      const element = valJson[i];
      const HTMLelement = `<img src="${element.thumb}" alt=""><div class="title">${element.title} - ${element.subtitle} </div>`;
      item.innerHTML = HTMLelement;
      container.appendChild(item);
    }
  }

  updateAttributes(elements) {
    const elementos = JSON.stringify(elements);
    this.setAttribute('elements', elementos);

    const list = this.shadow.querySelector('#elements');

    Array.from(list.children).forEach((element) => {
      element.onclick = () => {
        Array.from(list.children).forEach((elementico) => {
          elementico.classList.remove('playing');
        });
        const i = [...list.children].indexOf(element);
        element.classList.add('playing');
        this.sendData(i);
      };
    });
  }

  sendData(i) {
    const elementsJSON = JSON.parse(this.elements);
    updatePlayer(elementsJSON[i]);
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
