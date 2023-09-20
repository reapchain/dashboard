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
          label="Proposal Description"
          label-for="ProposalDescription"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="ProposalDescription"
          >
            <b-input-group class="mb-25">
              <b-form-textarea
                id="ProposalDescription"
                v-model="proposalDescription"
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
        <b-form-group
          :label="
            minInitDepositAmount
              ? `Proposal Deposit(over ${toNormalFloat(
                  minInitDepositAmount
                )} REAP)`
              : `Proposal Deposit`
          "
          label-for="ProposalDeposit"
        >
          <validation-provider
            v-slot="{ errors }"
            :rules="
              `required|regex:^([0-9\.]+)$|min-value:${minInitDepositAmount}`
            "
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
    <b-row v-if="proposalType === 'Parameter'">
      <b-col>
        <b-form-group label="Changes" label-for="Changes">
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Changes"
          >
            <div
              class="changes"
              v-for="(change, i) in changes"
              :key="`change-${i}`"
            >
              <span>
                subspace
                <b-form-input
                  :id="`change-${i}`"
                  prepend="First and last name"
                  v-model="change.subspace"
                />
              </span>
              <span>
                key
                <b-form-input :id="`change-${i}`" v-model="change.key" />
              </span>
              <span>
                value
                <b-form-input :id="`change-${i}`" v-model="change.value" />
              </span>
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
                @click="clickChangeButton(i)"
                class="appendButton"
                size="sm"
              >
                {{ changes.length === i + 1 ? "+" : "-" }}
              </b-button>
            </div>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <template v-if="proposalType === 'Community'">
      <b-row>
        <b-col>
          <b-form-group label="Recipient" label-for="Recipient">
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="Recipient"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="Recipient"
                  v-model="communityPoolRecipient"
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
          <b-form-group label="Amount" label-for="CommunityPoolAmount">
            <validation-provider
              v-slot="{ errors }"
              rules="required|regex:^([0-9\.]+)$"
              name="CommunityPoolAmount"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="CommunityPoolAmount"
                  v-model="communityPoolAmount"
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
    </template>
    <template v-if="proposalType === 'RegisterStanding'">
      <b-row v-if="false">
        <b-col>
          <b-form-group label="Validator Address" label-for="ValidatorAddress">
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="ValidatorAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="ValidatorAddress"
                  v-model="registerValidatorAddress"
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
          <b-form-group label="Address" label-for="Address">
            <validation-provider
              #default="{ errors }"
              :rules="`required|account-prefix:reap`"
              name="Address"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="Address"
                  v-model="registerAddress"
                  placeholder="Input an account address"
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
          <b-form-group label="Moniker" label-for="Moniker">
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="Moniker"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="Moniker"
                  v-model="registerMoniker"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
    </template>
    <template v-if="proposalType === 'RemoveStanding'">
      <b-row>
        <b-col>
          <b-form-group label="Address" label-for="Address">
            <validation-provider
              #default="{ errors }"
              :rules="`required|account-prefix:reap`"
              name="Address"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="Address"
                  v-model="removeAddress"
                  placeholder="Input an account address"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
          <b-form-group
            v-if="false"
            label="Validator Address"
            label-for="ValidatorAddress"
          >
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="ValidatorAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="ValidatorAddress"
                  v-model="removeValidatorAddress"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
    </template>
    <template v-if="proposalType === 'ReplaceStanding'">
      <b-row>
        <b-col>
          <b-form-group label="Exist Address" label-for="ExistAddress">
            <validation-provider
              #default="{ errors }"
              :rules="`required|account-prefix:reap`"
              name="ExistAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="ExistAddress"
                  v-model="existAddress"
                  placeholder="Input an account address"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
          <b-form-group
            v-if="false"
            label="Exist Validator Address"
            label-for="ExistValidatorAddress"
          >
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="ExistValidatorAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="ExistValidatorAddress"
                  v-model="existValidatorAddress"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="false">
        <b-col>
          <b-form-group
            label="New Validator Address"
            label-for="NewValidatorAddress"
          >
            <validation-provider
              #default="{ errors }"
              rules="required"
              name="NewValidatorAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="NewValidatorAddress"
                  v-model="replaceValidatorAddress"
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
          <b-form-group label="New Address" label-for="NewAddress">
            <validation-provider
              #default="{ errors }"
              :rules="`required|account-prefix:reap`"
              name="NewAddress"
            >
              <b-input-group class="mb-25">
                <b-form-input
                  id="NewAddress"
                  v-model="replaceAddress"
                  placeholder="Input an account address"
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
          <b-form-group label="New Moniker" label-for="NewMoniker">
            <validation-provider #default="{ errors }" name="NewMoniker">
              <b-input-group class="mb-25">
                <b-form-input
                  id="NewMoniker"
                  v-model="replaceMoniker"
                  :state="errors.length > 0 ? false : null"
                />
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import {
  BRow,
  BCol,
  BButton,
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
  minValue,
} from "@validations";
import {
  formatToken,
  formatTokenDenom,
  getUnitAmount,
  getUserCurrency,
  getUserCurrencySign,
} from "@/libs/utils";
import Ripple from "vue-ripple-directive";
import { decode, encode, fromWords, toWords } from "bech32";

const proposalTypeOptions = [
  { label: "Text Proposal", value: "Text" },
  { label: "Parameter Change", value: "Parameter" },
  { label: "Community Pool Spend", value: "Community" },
  { label: "Register Standing Member", value: "RegisterStanding" },
  { label: "Remove Standing Member", value: "RemoveStanding" },
  { label: "Replace Standing Member", value: "ReplaceStanding" },
  // { label: "Software Upgrade Proposal", value: "Upgrade" },
  // {label: "Cancel Software Upgrade Proposal", value: "CancelUpgrade" },
  // {label: "Execute contract", value: "" },
];

export default {
  name: "TransforDialogue",
  components: {
    BRow,
    BCol,
    BButton,
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
  directives: {
    Ripple,
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
      changes: [
        {
          subspace: "",
          key: "",
          value: "",
        },
      ],
      proposalDescription: "",
      proposalDeposit: null,
      communityPoolRecipient: "",
      communityPoolAmount: null,

      // permission
      registerValidatorAddress: "",
      registerAddress: "",
      registerMoniker: "",
      removeAddress: "",
      removeValidatorAddress: "",
      existAddress: "",
      existValidatorAddress: "",
      replaceValidatorAddress: "",
      replaceAddress: "",
      replaceMoniker: "",

      minInitDepositAmount: null,

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
      minValue,
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
            description: this.proposalDescription,
            changes:
              this.proposalType === "Parameter" ? this.changes : undefined,
            recipient:
              this.proposalType === "Community"
                ? this.communityPoolRecipient
                : undefined,
            amount:
              this.proposalType === "Community"
                ? [
                    {
                      amount: getUnitAmount(
                        this.communityPoolAmount,
                        this.token
                      ),
                      denom: this.token,
                    },
                  ]
                : undefined,
            registerValidatorAddress:
              this.proposalType === "RegisterStanding"
                ? this.registerValidatorAddress
                : undefined,
            registerAddress:
              this.proposalType === "RegisterStanding"
                ? this.registerAddress
                : undefined,
            registerMoniker:
              this.proposalType === "RegisterStanding"
                ? this.registerMoniker
                : undefined,
            removeAddress:
              this.proposalType === "RemoveStanding"
                ? this.removeAddress
                : undefined,
            removeValidatorAddress:
              this.proposalType === "RemoveStanding"
                ? this.removeValidatorAddress
                : undefined,
            existAddress:
              this.proposalType === "ReplaceStanding"
                ? this.existAddress
                : undefined,
            existValidatorAddress:
              this.proposalType === "ReplaceStanding"
                ? this.existValidatorAddress
                : undefined,
            replaceValidatorAddress:
              this.proposalType === "ReplaceStanding"
                ? this.replaceValidatorAddress
                : undefined,
            replaceAddress:
              this.proposalType === "ReplaceStanding"
                ? this.replaceAddress
                : undefined,
            replaceMoniker:
              this.proposalType === "ReplaceStanding"
                ? this.replaceMoniker
                : undefined,
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
  async mounted() {
    this.$emit("update", {
      modalTitle: "New Proposal",
      historyName: "newProposal",
    });

    const depositParams = await this.$http.getGovernanceParameterDeposit();
    const permissionParams = await this.$http.getPermissionParameters();

    const initialDepositFactor =
      permissionParams.Initial_min_deposit_percentage;
    const tempInitialDepositFactor =
      (parseFloat(depositParams.min_deposit[0].amount.toString()) / 10 ** 18) *
      parseFloat(initialDepositFactor);

    this.minInitDepositAmount = tempInitialDepositFactor;
  },

  methods: {
    toNormalFloat(value) {
      let returnValue;
      if (value > 0) {
        returnValue = parseInt(value.toFixed(0), 10).toLocaleString();
      } else {
        returnValue = value.toLocaleString("fullwide", {
          maximumFractionDigits: 18,
        });
      }
      return returnValue;
    },
    clickChangeButton(index) {
      if (this.changes.length === index + 1) {
        this.changes.push({
          subspace: "",
          key: "",
          value: "",
        });
      } else {
        const newList = [...this.changes];
        newList.splice(index, 1);
        this.changes = newList;
      }
    },
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

<style lang="scss" scoped>
.changes {
  display: flex;
  padding-bottom: 5px;
  span {
    padding-right: 10px;
  }
}
.appendButton {
  width: 50px;
  font-size: 20px;
  height: 38px;
  margin-top: auto;
}
</style>
