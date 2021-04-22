import { html, render } from 'https://unpkg.com/lit-html?module';
import { login, logout } from './../services/auth.js';
import { Config } from './../../config.js';
import { getProduct, getProducts, getCategories } from './../services/api.js';
class PcOxidProductBox extends HTMLElement {
    constructor() {
        super();
        this.count = 0;

        this.root = this.attachShadow({ mode: "open" });

    }
    // default component callback
    async connectedCallback() {
        let me = this;
        me.update();
    }

    async renderProducts(num) {
        let me = this;
        let debugInfo = me.root.getElementById('debugInfo');
        // TODO: replace!
        let items = ['Shirt', 'Kite', 'Wakeboard', 'Bindung', 'Trapez'];
        var item = items[Math.floor(Math.random() * items.length)];
        let res = await getProducts(item);
        if (res) {
            let prods = res.body.data.products;
            console.log('prods', prods);
            if (typeof debugInfo !== 'undefined') {
                //debugInfo.innerHTML = JSON.stringify(prods);
                let str = '<h3>OXID GraphQL Products</h3>';
                let count = 0;
                prods.forEach(function(p) {
                    // TODO: replace!
                    if (count < num) {
                        str += `
                        <div class="box-article">
                            <a target="_blank" href="${p.seo.url}">${p.title}</a><br><img src="${p.imageGallery.images[0].icon}"/>
                            <button class="wkbutton bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded">
                                In den Warenkorb
                            </button>
                        </div>`;
                        count++;
                    }
                });
                debugInfo.innerHTML = str;
            }    
        }

    }

    inc() {
        this.count++;
        this.update();
    }

    dec() {
        this.count--;
        this.update();
    }

    template() {
        return html`
        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        <style>
          * {
              font-family: "Arial, Helvetica, Sans Serif"
          }
          .box-article {
              float: left;
              width: 230px;
              border: 1px solid black;
              padding: 6px;
              margin-right: 8px;
              height: 210px;
          }
          a, a:active, a:visited, a:hover {
              color: seagreen;
              text-decoration: none;
          }
          span {
            width: 4rem;
            display: inline-block;
            text-align: center;
          }
  
          .incbutton {
            width: 64px;
            height: 64px;
            border: none;
            background-color: seagreen;
            color: white;
          }
          .wkbutton {
              margin: 10px 0 10px 0;
          }
          #debugInfo {
            font-size: 80%;
            width: 840px;
            margin-top: 20px;
          }
        </style>
        <button class="incbutton rounded-full py-3 px-6" @click="${this.dec}">-</button>
        <span>${this.count}</span>
        <button class="incbutton rounded-full py-3 px-6" @click="${this.inc}">+</button>
        <div class="container mx-auto px-4" id="debugInfo"></div>
      `;
    }

    update() {
        render(this.template(), this.root, { eventContext: this });
        this.renderProducts(6);
    }
}

customElements.define("pc-oxid-productbox", PcOxidProductBox);
