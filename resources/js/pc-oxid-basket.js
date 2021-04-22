import { html, render } from 'https://unpkg.com/lit-html?module';
class PcOxidBasket extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        console.log("Shadow basket ...");

        this.update();
    }


    template() {
        return html`
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
            border: none;
            margin-left: 20px;
            padding: 10px;
            border-radius: 10px;
            background-color: seagreen;
            color: white;
          }
        </style>
        <div>PcOxidBasket</div>
      `;
    }

    update() {
        render(this.template(), this.shadowRoot, { eventContext: this });
    }
}

customElements.define("pc-oxid-basket", PcOxidBasket);
