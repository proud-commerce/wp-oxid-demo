import { html, render } from 'https://unpkg.com/lit-html?module';
import { getUserBasket } from './../services/api.js';
class PcOxidBasket extends HTMLElement {
    /**
     * default component constructor
     */
    constructor() {
        super();
        this.handleUpdateEvent = this.handleUpdateEvent.bind(this);
        this.root = this.attachShadow({ mode: "open" });
    }
    /**
     * default component callback
     */
    async connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        await this.update();
        // add listener to window for inter-component events
        window.addEventListener('pc-updatebasket-event', this.handleUpdateEvent);
    }
    /**
     * default component callback
     */
    disconnectedCallback() {
        window.removeEventListener('pc-updatebasket-event', this.handleUpdateEvent);
        super.disconnectedCallback && super.disconnectedCallback();
    }
    /**
     * Update event to re-render basket
     * @param Event e 
     */
    async handleUpdateEvent(e) {
        console.log('window listend to updatebasket event');
        await this.update();
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
    /**
     * Render content via LitHTML
     * @returns Element
     */
    template() {
        let me = this;
        let items = '<ul class="basketItems">';
        if (me.basket && typeof me.basket.body.data.basket !== undefined) {
            if (me.basket.body.data.basket.items !== undefined) {
                me.basket.body.data.basket.items.forEach(function (item) {
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
            left: 190px;
            top: 469px;
            width: 220px;
            min-height: 200px;
            margin-left: 20px;
            color: #000;
            border: 3px solid seagreen;
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

    /**
     * Refresh basket and re-render
     */
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

if (!customElements.get('pc-oxid-basket')) {
    customElements.define("pc-oxid-basket", PcOxidBasket);
}