import { html, render } from 'https://unpkg.com/lit-html?module';
import { login, logout } from './../services/auth.js';
import { Config } from './../../config.js';
import { getProducts, addToBasket } from './../services/api.js';
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
                        let button = '';
                        if (p.variants.length === 0) {
                            button = `
                            <button id="${p.id}" class="wkbutton rounded-lg bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded">
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 510.735 510.735" height="35" viewBox="0 0 510.735 510.735" width="35"><path d="m482.082 171.571h-51.609l-71.834-135.683c-3.876-7.321-12.951-10.114-20.275-6.238-7.321 3.876-10.114 12.954-6.238 20.275l64.403 121.646h-282.41l64.403-121.646c3.876-7.321 1.083-16.399-6.238-20.275-7.319-3.875-16.399-1.083-20.275 6.238l-71.835 135.683h-51.521c-15.799 0-28.653 12.854-28.653 28.653v33.321c0 15.134 11.796 27.557 26.677 28.577l50.322 209.217c1.621 6.741 7.651 11.492 14.584 11.492h327.47c6.93 0 12.958-4.748 14.582-11.484l50.44-209.227c14.873-1.028 26.66-13.447 26.66-28.575v-33.321c0-15.799-12.853-28.653-28.653-28.653zm-452.082 30h450.735v30.626h-450.735zm403.846 140.895h-65.674l10.022-80.269h75.003zm-163.458 110.365v-80.365h63.805l-10.034 80.365zm-83.774 0-10.043-80.365h63.817v80.365zm-129.063-190.634h75.008l10.031 80.269h-65.732zm105.24 0h77.597v80.269h-67.566zm107.597 80.269v-80.269h77.573l-10.022 80.269zm-186.315 30h62.265l10.043 80.365h-52.978zm323.166 80.365h-52.847l10.034-80.365h62.187z"/></svg>
                            </button>`;
                        }
                        str += `
                        <div class="box-article">
                            <br><img style="float: left" src="${p.imageGallery.images[0].icon}"/>
                            <div><a style="float: left;margin-left: 10px;color: #000" target="_blank" href="${p.seo.url}">${p.title}</a><br></div>
                            <div class="wrapper"></div>                            
                            ${button}
                        </div>`;
                        count++;
                    }
                });
                debugInfo.innerHTML = str;
                // add button event listener
                const buttons = me.root.querySelectorAll('.wkbutton');
                buttons.forEach(b => {
                    b.addEventListener('click', async function (e) {
                        //e.preventDefault();
                        await me.addItem(b.id, 1);
                    })
                });
            }    
        }

    }
    async addItem(id, am) {
        let me = this;
        const updateEvent = new CustomEvent("updatebasket", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                id: id
            }
        });                        
        await addToBasket(id, am);
        console.log('Dispatching event ...', updateEvent)
        me.dispatchEvent(updateEvent);
        console.log('window.basketComponent', window.basketComponent);
        window.basketComponent.update();

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
          .wrapper{
              clear: both;
              overflow: hidden;
          }
          .box-article {
              float: left;
              width: 240px;
              border: 1px solid black;
              padding: 6px;
              margin-right: 8px;
              height: 250px;
              margin-left: 15px;
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
            width: 62px;
            height: 62px;
            border:  3px solid seagreen;
            color: #000;
          }
          .wkbutton {
              margin: 10px 0 10px 0;
              background: none !important;
              border: 3px solid seagreen;
              float: right;
          }
          #debugInfo {
            font-size: 80%;
            width: 840px;
            margin-top: 20px;
          }
        </style>
        <button class="incbutton rounded-lg py-3 px-6" @click="${this.dec}">-</button>
        <span>${this.count}</span>
        <button class="incbutton rounded-lg py-3 px-6" @click="${this.inc}">+</button>
        <div class="container mx-auto px-4" id="debugInfo"></div>
      `;
    }

    update() {
        render(this.template(), this.root, { eventContext: this });
        this.renderProducts(6);
    }
}

customElements.define("pc-oxid-productbox", PcOxidProductBox);
