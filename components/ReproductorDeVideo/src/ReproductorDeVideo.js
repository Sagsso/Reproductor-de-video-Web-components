class ReproductorDeVideo extends HTMLElement {
  constructor() {
    super(); // Constructor del padre
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = this.attachShadow({ mode: 'open' });
    this.src = undefined;
    this.controls = undefined;
    this._volume = undefined;
    this.description = undefined;
    this.title = undefined;

    this.flag = {
      status: false,
      pending: {
        methods: [],
        values: []
      }
    }
  }

  get shadow() {
    // eslint-disable-next-line no-underscore-dangle
    return this._shadow;
  }

  set shadow(val) {
    // eslint-disable-next-line no-underscore-dangle
    this._shadow = val;
  }
  get volume() {
    return this.getAttribute('volume');
  }

  set volume(newvolume) {
    this.setAttribute('volume', newvolume);
  }

  static get observedAttributes() {
    return ['src', 'controls', 'description', 'title', 'volume'];
  }

  addListeners() {
    const video = this.shadow.querySelector('video');
    video.onvolumechange = (e) => {
      this.volume = Math.round(video.volume * 100)
    }
  }
  // /* attributeChangedCallback
  //    *
  //    * Se ejecuta cuando el valor de cualquier atributo declarado dentro del arreglo de los
  // * observedAttributes cambia.
  // *
  //    * @param { string } name nombre del atributo que cambia
  // * @param { mixed } oldVal valor anterior del atributo
  //   * @param { mixed } newValue nuevo valor del atributo
  //     * /
  attributeChangedCallback(name, oldVal, newValue) {
    // this[`update${name.charAt(0).toUpperCase() + name.slice(1)}`](newValue);


    if (this.flag.status) {
      this[`update${name.charAt(0).toUpperCase() + name.slice(1)}`](newValue);
    } else {
      this.flag.pending.methods.push(`update${name.charAt(0).toUpperCase() + name.slice(1)}`);
      this.flag.pending.values.push(newValue);
    }

  }

  // updateVolume(val) {
  //   this.volume = Math.round(val * 100);
  //   console.log('Se cambió el volumen')
  // }

  updateSrc(val) {
    this.shadow.querySelector('video').setAttribute('src', val);
  }

  updateVolume(val) {
    const video = this.shadow.querySelector('video');
    video.volume = val / 100;
  }

  updateDescription(val) {
    this.shadow.querySelector('#description').innerHTML = val;
    console.log('se llamó')
  }

  updateTitle(val) {
    this.shadow.querySelector('#title').innerHTML = val;
  }

  updateControls(val) {
    if (val == true) {
      this.shadow.querySelector('video').setAttribute("controls", "controls")
    } else {
      this.shadow.querySelector('video').removeAttribute('controls');
    }
  }


  callPending() {
    console.log('holaaa callPending')

    for (let i = 0; i < this.flag.pending.methods.length; i++) {
      const pending = this.flag.pending.methods[i];
      const value = this.flag.pending.values[i];
      this[pending](value);
    }
  }

  connectedCallback() {
    let template;
    fetch('./components/ReproductorDeVideo/template.html', {
      method: 'GET',
    }).then((response) => {
      response.text().then((data) => {
        template = data;
        this.shadow.innerHTML = template;
        this.callPending();
        this.flag.status = true;
        this.addListeners();
      });
    });

  }

}
window.customElements.define('repro-video', ReproductorDeVideo);
