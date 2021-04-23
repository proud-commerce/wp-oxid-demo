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

    /**
     * Get plain HTML inside the dom / lit template
     * Something like "unsafeHTML", so use carefully
     * @param string html 
     */
    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        // html may contain multiple siblings and children, so add wrapping element
        template.innerHTML = '<div>' + html + '</div>';
        return template.content.firstChild;
    }

    template() {
        let me = this;
        let items = '<ul class="basketItems">';
        if (me.basket && typeof me.basket.body.data.basket !== undefined) {
            if (me.basket.body.data.basket.items !== undefined) {
                me.basket.body.data.basket.items.forEach(function(item) {
                    console.log('item', item);
                    items = items + `<li class="basketItem">${item.amount} x ${item.product.title} (${item.product.price.price}&euro;)</li>`;
                });
            }
        }
        items = items + `</ul>`;
        let el = me.htmlToElement(items);
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
            min-height: 200px;
            margin-left: 20px;
            background-color: seagreen;
            color: white;
          }
        </style>
        <div class="basketcontainer rounded-lg py-3 px-4">
            <div class="basketHeader">Oxid Warenkorb</div>
            <div class="basketContent">
            ${el}
           </div>
        </div>
      `;
      //  ${JSON.stringify(me.basket, null, 2)}
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
