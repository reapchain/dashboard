<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group label="Delegator" label-for="Delegator">
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Delegator"
          >
            <b-form-input v-model="selectedAddress" readonly />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <validation-provider
          #default="{ errors }"
          rules="required"
          name="Validator"
        >
          <b-form-group label="Validator" label-for="validator">
            <v-select
              v-model="selectedValidator"
              :options="valOptions"
              :reduce="(val) => val.value"
              placeholder="Select a validator"
              :readonly="validatorAddress"
              :selectable="(v) => v.value"
            />
          </b-form-group>
          <small class="text-danger">{{ errors[0] }}</small>
        </validation-provider>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Available Token" label-for="Token">
          <validation-provider rules="required" name="Token">
            <b-form-select v-model="token" text-field="label">
              <b-form-select-option
                v-for="x in balanceOptions"
                :key="x.denom"
                :value="x.denom"
              >
                {{ format(x) || "balance is zero.." }}
              </b-form-select-option>
            </b-form-select>
            <!-- <small class="text-danger">{{ errors[0] }}</small> -->
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Amount" label-for="Amount">
          <validation-provider
            v-slot="{ errors }"
            rules="required|regex:^([0-9\.]+)$"
            name="amount"
          >
            <b-input-group>
              <b-form-input
                id="Amount"
                v-model="amount"
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
  BFormInput,
  BFormGroup,
  BFormSelect,
  BFormSelectOption,
  BInputGroupAppend,
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
import { formatToken, formatTokenDenom, getUnitAmount } from "@/libs/utils";
import vSelect from "vue-select";

export default {
  components: {
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    vSelect,
    BInputGroupAppend,

    ValidationProvider,
  },
  props: {
    validatorAddress: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    balance: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedAddress: this.address,
      availableAddress: [],
      validators: [],
      unbondValidators: [],
      selectedValidator: this.validatorAddress,
      token: "",
      amount: null,
      selectedChain: "",
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
    valOptions() {
      let options = [];
      const vals = this.validators.map((x) => ({
        value: x.operator_address,
        label: `${x.description.moniker} (${Number(x.commission.rate) * 100}%)`,
        type: x.type,
        disabled:
          !this.$store?.state?.chains?.defaultWallet ||
          (x.type === "steering" &&
            this.$store?.state?.chains?.defaultWallet.substring(5, 37) !==
              x.operator_address.substring(12, 44)),
      }));

      if (vals.length > 0) {
        const activeSteering = vals.filter(
          (validator) => validator.type === "steering" && !validator.disabled
        );
        if (activeSteering.length > 0) {
          options.push({
            value: null,
            label: "=== MY STEERING VALIDATOR ===",
          });
          options = options.concat(activeSteering);
        }

        options.push({
          value: null,
          label: "=== ACTIVE STANDING VALIDATORS ===",
        });

        const activeStandingList = vals.filter(
          (validator) => validator.type === "standing"
        );
        options = options.concat(activeStandingList);
      }

      const unbonded = this.unbondValidators.map((x) => ({
        value: x.operator_address,
        label: `* ${x.description.moniker} (${Number(x.commission.rate) *
          100}%)`,
        type: x.type,
      }));

      const inactiveStandingList = unbonded.filter(
        (validator) => validator.type === "standing"
      );

      if (unbonded.length > 0) {
        options.push({
          value: null,
          label: "=== INACTIVE STANDING VALIDATORS ===",
          disabled: true,
        });
        options = options.concat(inactiveStandingList);
      }

      return options;
    },
    balanceOptions() {
      return this.setupBalance();
    },
    msg() {
      return [
        {
          typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
          value: {
            delegatorAddress: this.selectedAddress,
            validatorAddress: this.selectedValidator,
            amount: {
              amount: getUnitAmount(this.amount, this.token),
              denom: this.token,
            },
          },
        },
      ];
    },
    IBCDenom() {
      return this.$store.state.chains.denoms;
    },
  },
  mounted() {
    this.$emit("update", {
      modalTitle: "Delegate Token",
      historyName: "delegate",
    });
    this.loadData();
  },
  methods: {
    loadData() {
      this.$http.getValidatorList().then((v) => {
        this.validators = v;
      });
      this.$http.getValidatorUnbondedList().then((v) => {
        this.unbondValidators = v;
      });
    },
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom;
        return this.balance;
      }
      return [];
    },
    printDenom() {
      return formatTokenDenom(this.token);
    },
    format(v) {
      return formatToken(v, this.IBCDenom, 18);
    },
  },
};
</script>

<style lang="scss" scoped></style>
