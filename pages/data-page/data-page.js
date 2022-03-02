import { CellsPage } from '@cells/cells-page';
import { html, css } from 'lit-element';
import '@cells-components/cells-template-paper-drawer-panel';
import '@bbva-web-components/bbva-header-main';

class DataPage extends CellsPage {
  static get is() {
    return 'data-page';
  }

  constructor() {
    super();
    this.headerTitle = 'My Data';
    this.totalGoalAmount = 0;
    this.totalSavedAmount = 0;
    this.handleChannels();
  }

  handleChannels() {
    this.subscribe('total-goals-channel', data => {
      this.totalGoalAmount = data.totalGoalAmount;
      this.totalSavedAmount = data.totalSavedAmount;
    });
  }

  static get properties() {
    return {
      headerTitle: { type: String },
      totalSavedAmount: { type: Number },
      totalGoalAmount: { type: Number },
      goals: { type: Array }
    };
  }

  goBack() {
    this.navigate('goal');
  }

  render() {
    return html`
      <cells-template-paper-drawer-panel mode="seamed">
        <div slot="app__header">
          <bbva-header-main
            icon-left1="coronita:return-12"
            @header-main-icon-left1-click=${this.goBack}
            text=${this.headerTitle}>
          </bbva-header-main>
        </div>

        <div slot="app__main" class="container">
          <bbva-list-goal
            goal-title="Summary"
            amount=${this.totalSavedAmount}
            total-amount=${this.totalGoalAmount}
            show-amounts
            ?show-completed-goal=${this.totalSavedAmount>=this.totalGoalAmount}
            >
          </bbva-list-goal>

        </div>
     </cells-template-paper-drawer-panel>`;
  }

  static get styles() {
    return css`
      bbva-header-main {
        --bbva-header-main-bg-color: #002171;
      }`;
  }
}
window.customElements.define(DataPage.is, DataPage);