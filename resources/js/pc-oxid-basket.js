import { html, render } from 'https://unpkg.com/lit-html?module';
import { login } from './../services/auth.js';
import { getUserBasket } from './../services/api.js';
import { Config } from './../../config.js';
class PcOxidBasket extends HTMLElement {
    constructor() {
        super();

        this.root = this.attachShadow({ mode: "open" });
    }
    // default component callback
    async connectedCallback() {
        let me = this;
        await me.update();
        //setTimeout(function() {
        //}, 1000);
    }

    template() {
        let me = this;
        let h = html`
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        <style>
          * {
            font-size: 90%;
          }
  
          .basketcontainer {
              position: absolute;
            float: right;
            top: 200px;
            width: 220px;
            height: 200px;
            margin-left: 20px;
            background-color: seagreen;
            color: white;
          }
        </style>
        <div class="basketcontainer rounded-lg py-3 px-4">
            <div class="basketHeader">PcOxidBasket</div>
            <div class="basketContent">${JSON.stringify(me.basket, null, 2)}</div>
        </div>
      `;
        return h;
    }

    async update() {
        let me = this;
        let basket = await getUserBasket();
        if (basket) {
            console.log('pcBasket:', basket);
            me.basket = basket;
        }
        render(this.template(), this.root);
    }
}

customElements.define("pc-oxid-basket", PcOxidBasket);
