# OXID GraphQL Wordpress Plugin

## Idee

OXID Produkte und Warenkorb möglichst leichtgewichtig in Wordpress und andere externe Anwendungen integrieren.

Daher möglichst wenig Wordpress Code verwenden. Stattdessen nur einzelne Webcomponents bauen, die die eigentliche Arbeit und Kommunikation per Javascript erledigen.

In Wordpress werden nur die Resourcen geladen und 2 definierte Webcomponents eingebunden:

```php
function pc_oxid_productbox($content)
{
    $pc_oxid_productbox = '';
    if (is_single()) {
        // add our webcomponents!
        $pc_oxid_productbox .= '<div><pc-oxid-productbox></pc-oxid-productbox></div>';
        $pc_oxid_productbox .= '<pc-oxid-basket></pc-oxid-basket>';
    }
    $content .= $pc_oxid_productbox;
    return $content;
}
```

Die Webcomponents laden dann die Daten und interagieren über GraphQL.

```javascript
import { html, render } from 'https://unpkg.com/lit-html?module';
import { login, logout } from './../services/auth.js';
import { getProduct, getProducts, getCategories } from './../services/api.js';
class PcOxidProductBox extends HTMLElement {
    constructor() {
        super();
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
        let items = ['Shirt', 'Kite', 'Wakeboard', 'Bindung', 'Trapez'];
        var item = items[Math.floor(Math.random() * items.length)];
        let res = await getProducts(item);
        if (res) {
            let prods = res.body.data.products;
            if (typeof debugInfo !== 'undefined') {
                let str = '<h3>OXID GraphQL Products</h3>';
                let count = 0;
                prods.forEach(function(p) {
                    // TODO: replace!
                    if (count < num) {
                        str += `<div class="box-article"><a target="_blank" href="${p.seo.url}">${p.title}</a><br><img src="${p.imageGallery.images[0].icon}"/></div>`;
                        count++;
                    }
                });
                debugInfo.innerHTML = str;
            }    
        }

    }
    template() {
        return html`
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
              height: 150px;
          }
          a, a:active, a:visited, a:hover {
              color: seagreen;
              text-decoration: none;
          }
  
          #debugInfo {
            font-size: 80%;
            width: 840px;
            margin-top: 20px;
          }
        </style>
        <div id="debugInfo"></div>
      `;
    }

    update() {
        render(this.template(), this.root, { eventContext: this });
        this.renderProducts(6);
    }
}
customElements.define("pc-oxid-productbox", PcOxidProductBox);

```