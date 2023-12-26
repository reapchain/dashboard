import ValidatorCommission from "./validator-commission";
import ValidatorDescription from "./valdiator-description";

export default class Validator {
  constructor() {
    this.operator_address = "";
    this.consensus_pubkey = "";
    this.jailed = true;
    this.status = 0;
    this.tokens = 0;
    this.delegator_shares = 0;
    this.description = new ValidatorDescription();
    this.bond_height = 0;
    this.bond_intra_tx_counter = 0;
    this.unbonding_height = 0;
    this.unbonding_time = "";
    this.commission = new ValidatorCommission();
    this.min_self_delegation = 1;
    this.type = "";
  }

  init(element) {
    this.operator_address = element.operator_address;
    this.consensus_pubkey = element.consensus_pubkey;
    this.jailed = element.jailed;
    this.status = element.status;
    this.tokens = Number(element.tokens);
    this.delegator_shares = Number(element.delegator_shares);
    this.description = new ValidatorDescription().init(element.description);
    this.bond_height = Number(element.bond_height);
    this.bond_intra_tx_counter = element.bond_intra_tx_counter;
    this.unbonding_height = element.unbonding_height;
    this.unbonding_time = element.unbonding_time;
    this.commission = new ValidatorCommission().init(element.commission);
    this.min_self_delegation = element.min_self_delegation;
    this.type = element.type;
    return this;
  }
}
