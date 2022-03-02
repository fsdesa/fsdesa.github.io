import { CellsPage } from '@cells/cells-page';
import { BbvaCoreIntlMixin } from '@bbva-web-components/bbva-core-intl-mixin';
import { html, css } from 'lit-element';
import { spread } from '@open-wc/lit-helpers';

import '@cells-components/cells-template-paper-drawer-panel';
import '@cells-components/cells-skeleton-loading-page';
import '@bbva-web-components/bbva-header-main';
import '@bbva-web-components/bbva-list-movement';
import '@bbva-web-components/bbva-help-modal';

import { getMovements } from '../../elements/movements-dm/movements-dm.js';
import { normalizeUriString } from '../../elements/utils/text.js';

/* eslint-disable new-cap */
class DashboardPage extends BbvaCoreIntlMixin(CellsPage) {
  static get is() {
    return 'dashboard-page';
  }

  constructor() {
    super();

    this.movements = [];
  }

  static get properties() {
    return {
      userName: { type: String },
      movements: { type: Array },
    };
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);

    this._logoutModal = this.shadowRoot.querySelector('#logoutModal');
  }

  onPageEnter() {
    this.subscribe('user_name', (userName) => this.userName = userName);

    if (!this.movements.length) {
      getMovements().then((movements) => {
        this.movements = movements;
      });
    }
  }

  onPageLeave() {

  }

  handleMovementClick({ id, label }) {
    this.publish('movement_title', label);
    this.navigate('movement-detail', { id, label: normalizeUriString(label), });
  }

  get movementList() {
    if (!this.movements.length) {
      return null;
    }

    return this.movements.map((movement) => {
      const movementProperties = this.buildMovementProperties(movement);

      return html`
        <bbva-list-movement
          ...="${spread(movementProperties)}">
        </bbva-list-movement>
      `;
    });
  }

  buildMovementProperties(movement) {
    const { description, label, parsedAmount, parsedAcountingBalance, categoryDescription, badge, icon, product } = movement;

    return {
      ...(description && { 'description': description }),
      ...(label && { 'card-title': label }),
      ...(parsedAmount && { 'amount': parsedAmount.value, 'local-currency': parsedAmount.currency, 'currency-code': parsedAmount.currency }),
      ...(parsedAcountingBalance && { 'secondary-amount': parsedAcountingBalance.value }),
      ...(categoryDescription && { 'concept': categoryDescription }),
      ...(badge && { 'badge-text': badge.label, 'badge-text-type': badge.status }),
      ...(icon && { icon }),
      ...(product && { mask: product }),
      '@click': () => this.handleMovementClick(movement),
      'class': 'bbva-global-semidivider',
      'aria-label': 'Ver detalle del pago con tarjeta',
      'language': 'es',
    };
  }

  render() {
    return html`
      <cells-template-paper-drawer-panel mode="seamed">
        <div slot="app__header">
          <bbva-header-main
            icon-left-primary="coronita:on"
            accessibility-text-icon-left-primary="Cerrar Sesión"
            @header-main-icon-left-primary-click=${() => this._logoutModal.open()}
            icon-right-primary="coronita:help"
            accessibility-text-icon-right-primary="Ayuda"
            @header-main-icon-right-primary-click=${() => this.navigate('help')}
            text=${this.t('dashboard-page.header', '', { name: this.userName })}>
          </bbva-header-main>
        </div>

        <div slot="app__main" class="container">
          ${this.movementList ? html`${this.movementList}` : html`<cells-skeleton-loading-page visible></cells-skeleton-loading-page>`}

          <bbva-help-modal
            id="logoutModal"
            header-icon="coronita:info"
            header-text=${this.t('dashboard-page.logout-modal.header')}
            button-text=${this.t('dashboard-page.logout-modal.button')}
            @help-modal-footer-button-click=${() => window.cells.logout()}>
            <div slot="slot-content">
              <span>${this.t('dashboard-page.logout-modal.slot')}</span>
            </div>
          </bbva-help-modal>
        </div>
     </cells-template-paper-drawer-panel>`;
  }

  static get styles() {
    return css`
      bbva-header-main {
        --bbva-header-main-bg-color: #002171;
      }

      cells-template-paper-drawer-panel {
        background-color: #5472d3;
      }
    `;
  }
}

window.customElements.define(DashboardPage.is, DashboardPage);