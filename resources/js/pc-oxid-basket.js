import { html, render } from 'https://unpkg.com/lit-html?module';
import { login } from './../services/auth.js';
import { Config } from './../../config.js';
class PcOxidBasket extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }
    // default component callback
    async connectedCallback() {
        let me = this;
        me.update();
    }

    template() {
        return html`
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        <style>
          * {
            font-size: 90%;
          }
  
          div {
              position: absolute;
            float: right;
            top: 200px;
            width: 200px;
            height: 200px;
            margin-left: 20px;
            background-color: seagreen;
            color: white;
          }
        </style>
        <div class="rounded-lg py-3 px-4">PcOxidBasket</div>
      `;
    }

    update() {
        render(this.template(), this.shadowRoot, { eventContext: this });
    }
}

customElements.define("pc-oxid-basket", PcOxidBasket);
