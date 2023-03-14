<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group label="Sender" label-for="sender">
          <b-input-group class="mb-25">
            <b-form-input name="sender" :value="address" readonly />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Proposal Type" label-for="ProposalType">
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="proposalType"
          >
            <b-form-select v-model="proposalType">
              <b-form-select-option
                v-for="item in proposalTypeOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </b-form-select-option>
            </b-form-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Proposal Title" label-for="ProposalTitle">
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="ProposalTitle"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="ProposalTitle"
                v-model="proposalTitle"
                :state="errors.length > 0 ? false : null"
              />
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Proposal Discription"
          label-for="ProposalDiscription"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="ProposalDiscription"
          >
            <b-input-group class="mb-25">
              <b-form-textarea
                id="ProposalDiscription"
                v-model="proposalDiscription"
                :state="errors.length > 0 ? false : null"
                rows="5"
              />
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Available Token" label-for="Token">
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Token"
          >
            <b-form-select v-model="token">
              <b-form-select-option
                v-for="item in balanceOptions"
                :key="item.denom"
                :value="item.denom"
              >
                {{ format(item) }}
              </b-form-select-option>
            </b-form-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Proposal Deposit" label-for="ProposalDeposit">
          <validation-provider
            v-slot="{ errors }"
            rules="required|regex:^([0-9\.]+)$"
            name="ProposalDeposit"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="ProposalDeposit"
                v-model="proposalDeposit"
                :state="errors.length > 0 ? false : null"
                placeholder="Input a number"
                type="number"
              />
              <b-input-group-append is-text>
                {{ printDenom() }}
              </b-input-group-append>
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
          <b-form-text v-show="false">
            ≈
            <strong class="text-primary"
              >{{ currencySign }}{{ valuation }}</strong
            >
          </b-form-text>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import {
  BRow,
  BCol,
  BInputGroup,
  BInputGroupAppend,
  BFormInput,
  BFormGroup,
  BFormSelect,
  BFormSelectOption,
  BFormText,
  BFormTextarea,
} from "bootstrap-vue";
import {
  required,
  email,
  url,
  between,
  alpha,
  integer,
  password,
  min,
  digits,
  alphaDash,
  length,
} from "@validations";
import {
  formatToken,
  formatTokenDenom,
  getUnitAmount,
  getUserCurrency,
  getUserCurrencySign,
} from "@/libs/utils";

const proposalTypeOptions = [
  { label: "Text Proposal", value: "Text" },
  { label: "Parameter Change", value: "Parameter" },
  { label: "Software Upgrade Proposal", value: "Upgrade" },
  // {label: "Cancel Software Upgrade Proposal", value: "CancelUpgrade" },
  // {label: "Execute contract", value: "" },
  // {label: "Community pool spend", value: "Text" },
];

export default {
  name: "TransforDialogue",
  components: {
    BRow,
    BCol,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BFormText,
    BFormTextarea,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    ValidationProvider,
  },
  props: {
    address: {
      type: String,
      default: "",
    },
    balance: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currency: getUserCurrency(),
      currencySign: getUserCurrencySign(),
      token: "",
      amount: null,

      // form option
      proposalTypeOptions,

      // form data
      proposalType: proposalTypeOptions[0].value,
      proposalTitle: "",
      proposalDiscription: "",
      proposalDeposit: null,

      required,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
    };
  },
  computed: {
    msg() {
      return [
        {
          typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
          value: {
            initialDeposit: [
              {
                amount: getUnitAmount(this.proposalDeposit, this.token),
                denom: this.token,
              },
            ],
            type: this.proposalType,
            proposer: this.address,
            title: this.proposalTitle,
            description: this.proposalDiscription,
          },
        },
      ];
    },
    balanceOptions() {
      return this.setupBalance();
    },
    IBCDenom() {
      return this.$store.state.chains.denoms;
    },
    valuation() {
      const { proposalDeposit } = this;
      if (proposalDeposit) {
        const d2 = this.printDenom();
        const quote = this.$store.state.chains.quotes[d2];
        const price = quote ? quote[this.currency] : 0;
        return parseFloat((proposalDeposit * price).toFixed(2));
      }
      return 0;
    },
  },
  mounted() {
    this.$emit("update", {
      modalTitle: "New Proposal",
      historyName: "newProposal",
    });
  },

  methods: {
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom;
        return this.balance;
      }
      return [];
    },
    format(v) {
      return formatToken(v, this.IBCDenom, 6);
    },
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token);
    },
  },
};
</script>
