import { CellsPage } from '@cells/cells-page';
import { BbvaCoreIntlMixin } from '@bbva-web-components/bbva-core-intl-mixin';
import { html, css } from 'lit-element';

import '@cells-components/cells-template-paper-drawer-panel';
import '@bbva-web-components/bbva-header-main';
import '@bbva-web-components/bbva-form-field';
import '@bbva-web-components/bbva-form-password';
import '@bbva-web-components/bbva-button-default';

import { cleanUp } from '../../elements/movements-dm/movements-dm';

/* eslint-disable new-cap */
class LoginPage extends BbvaCoreIntlMixin(CellsPage) {
  static get is() {
    return 'login-page';
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);

    this._userInput = this.shadowRoot.querySelector('#user');
    this._passwordInput = this.shadowRoot.querySelector('#password');
  }

  render() {
    return html`
      <cells-template-paper-drawer-panel mode="seamed">
        <div slot="app__header">
          <bbva-header-main
            text="BBVA">
          </bbva-header-main>
        </div>

        <div slot="app__main" class="container">
          <bbva-form-field
            id="user"
            auto-validate
            validate-on-blur
            label=${this.t('login-page.user-input')}
            required>
          </bbva-form-field>

          <bbva-form-password
            id="password"
            auto-validate
            validate-on-blur
            label=${this.t('login-page.password-input')}
            required>
          </bbva-form-password>

          <bbva-button-default
            @click=${this.handleValidation}>
              ${this.t('login-page.button')}
          </bbva-button-default>
        </div>
     </cells-template-paper-drawer-panel>`;
  }

  handleValidation() {
    let canContinue = true;

    [this._userInput, this._passwordInput].forEach((el) => (el.validate(), el.invalid && (canContinue = false)));

    if (canContinue) {
      this.publish('user_name', this._userInput.value);
      this.navigate('dashboard');
    }
  }

  onPageEnter() {
    // Cada vez que accedamos al login, simulamos una limpieza de los datos almacenados en memoria.
    cleanUp();
  }

  onPageLeave() {
    // Cada vez que salgamos del login, limpiamos las cajas de texto.
    setTimeout(() => [this._userInput, this._passwordInput].forEach((el) => el.clearInput()), 3 * 1000);
  }

  static get styles() {
    return css`
      bbva-header-main {
        --bbva-header-main-bg-color: #002171;
      }

      cells-template-paper-drawer-panel {
        background-color: #5472d3;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .container > * {
        margin-top: 10px;
      }
    `;
  }
}

window.customElements.define(LoginPage.is, LoginPage);