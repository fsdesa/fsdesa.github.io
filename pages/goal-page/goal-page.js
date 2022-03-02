import {CellsPage} from '@cells/cells-page';
import {html, css} from 'lit-element';
import '@cells-components/cells-template-paper-drawer-panel';
import '@bbva-web-components/bbva-form-field';
import '@bbva-web-components/bbva-form-amount';
import '@bbva-web-components/bbva-button-default';
import '@bbva-web-components/bbva-list-goal';
import '@bbva-web-components/bbva-header-main';
import { setComponentSharedStyles } from '@cells-components/cells-lit-helpers';

class GoalPage extends CellsPage {
  static get is() {
    return 'goal-page';
  }

  static get properties() {
    return {
      headerTitle: { type: String },
      goals: { type: Array },
      newGoalDescription: { type: String },
      newGoalAmount: { type: Number }
    };
  }

  constructor() {
    super();
    this.headerTitle = 'My Goals';
    this.goals = [];
    this.newGoalDescription = '';
    this.newGoalAmount = 0;
  }

  get noGoalData() {
    return (this.newGoalDescription.trim() === '') || (this.newGoalAmount<=0);
  }

  get totals() {
    let totalGoalAmount = 0;
    let totalSavedAmount = 0;
    this.goals.forEach(g => {
      totalGoalAmount = totalGoalAmount + g.goalAmount;
      totalSavedAmount = totalSavedAmount + g.savedAmount;
    });
    return {totalGoalAmount, totalSavedAmount};
  }

  addGoal() {
    this.goals = [...this.goals, {
      description: this.newGoalDescription,
      savedAmount: 0,
      goalAmount: this.newGoalAmount}
    ];
    this.newGoalDescription = '';
    this.newGoalAmount = 0;
  }

  addMoney(selecteIndex) {
    this.goals[selecteIndex].savedAmount = this.goals[selecteIndex].savedAmount + 10;
    this.goals = [].concat(this.goals);
  }

  removeGoal(selecteIndex) {
    this.goals.splice(selecteIndex, 1);
    this.goals = [].concat(this.goals);
  }

  gotoData() {
    this.publish('total-goals-channel', this.totals);
    this.navigate('data');
  }

  static get styles() {
    setComponentSharedStyles('bbva-progress-bar-default-shared-styles',
    css`.progress-bar { height: 100% }`);
    return css`
      bbva-header-main {
        --bbva-header-main-bg-color: #002171;
      }`;
  }

  render() {
    return html`
      <cells-template-paper-drawer-panel mode="seamed">
        <div slot="app__header">
          <bbva-header-main
            icon-right1="coronita:graphics"
            @header-main-icon-right1-click=${this.gotoData}
            text=${this.headerTitle}>
          </bbva-header-main>
        </div>

        <div slot="app__main" class="container">
          <div>
            <bbva-form-field
              @change=${e=>{this.newGoalDescription = e.target.value;}}
              label="Goal"
              value=${this.newGoalDescription}>
            </bbva-form-field>
            <bbva-form-amount
              @form-amount-input-change=${e=>{this.newGoalAmount = e.detail.amount;}}
              label="Amount"
              amount=${this.newGoalAmount}
              language="es">
            </bbva-form-amount>
            <bbva-button-default @click=${this.addGoal} ?disabled=${this.noGoalData} >Add</bbva-button-default>
          </div>
          <hr>
          ${this.goals.map((g, i) =>
            html`
              <bbva-list-goal
                goal-title=${g.description}
                amount=${g.savedAmount}
                total-amount=${g.goalAmount}
                simple-link=${g.savedAmount<g.goalAmount ? "Add 10€" : ""}
                icon="coronita:trash"
                show-amounts
                icon-has-action
                ?show-completed-goal=${g.savedAmount>=g.goalAmount}
                @list-goal-simple-link-click=${e=>this.addMoney(i)}
                @list-goal-action-click=${e=>this.removeGoal(i)}
                >
              </bbva-list-goal><hr>`
            )
          }
        </div>
      </cells-template-paper-drawer-panel>`;
  }
}

window.customElements.define(GoalPage.is, GoalPage);