<template>
  <div>
    <b-card no-body class="text-truncate">
      <b-card-header v-show="false">
        <b-card-title>
          Accounts
        </b-card-title>
      </b-card-header>
      <b-table
        :items="accounts"
        :fields="list_fields"
        :sort-desc="true"
        striped
        hover
        stacked="sm"
      >
        <template #cell(address)="data">
          <router-link :to="`./account/${data.item.address}`">
            {{ data.item.address }}
          </router-link>
        </template>
        <template #cell(balance)="data">
          {{ data.item.displayBalance }}
        </template>
      </b-table>
    </b-card>
    <div class="mt-3" style="padding-bottom: 36px;">
      <b-pagination
        style="position: absolute; left: 50%; margin-left: -145px;"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="accounts-table"
        @page-click="pageClick"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import {
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  VBTooltip,
  BPagination,
} from "bootstrap-vue";
import { formatToken } from "@/libs/utils";

export default {
  components: {
    BCard,
    BTable,
    BCardHeader,
    BCardTitle,
    BPagination,
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      totalRows: 0,
      perPage: 20,
      accounts: [],
      list_fields: [
        {
          key: "address",
        },
        {
          key: "balance",
        },
      ],
    };
  },
  created() {
    this.loading = true;
    this.fetchAccountList(1);
  },
  methods: {
    async fetchAccountList(page) {
      const offset = 20 * (page - 1);
      const query = {
        "pagination.offset": offset,
        "pagination.limit": this.perPage,
        "pagination.count_total": true,
      };
      const queryString = this.makeQueryString(query);

      this.$http.getAllAccounts(queryString).then(async (res) => {
        this.totalRows = Number(res.pagination.total);
        await this.getAccountList(res.accounts);
        this.loading = false;
      });
    },
    async getAccountList(accounts) {
      const accountList = await Promise.all(
        accounts.map(async (account) => {
          let tempAccount = {
            address: "",
            type: "",
            balance: 0,
            displayBalance: "0 REAP",
          };
          if (account["@type"] === "/cosmos.auth.v1beta1.ModuleAccount") {
            tempAccount.address = account.base_account.address;
            tempAccount.type = "ModuleAccount";
          } else if (account.base_account) {
            tempAccount.address = account.base_account.address;
            tempAccount.type = "BaseAccount";
          } else if (account.base_vesting_account) {
            tempAccount.address =
              account.base_vesting_account.base_account.address;
            tempAccount.type = "ClawbackVestingAccount";
          }

          const tokens = await this.$http.getBankAccountBalance(
            tempAccount.address
          );
          const reapToken = this.findReapItem(tokens);

          if (reapToken) {
            tempAccount.balance = reapToken;
            tempAccount.displayBalance = this.formatToken(reapToken);
          }

          return tempAccount;
        })
      );
      this.accounts = accountList;
    },
    pageClick(button, page) {
      this.accounts = [];
      this.fetchAccountList(page);
    },
    makeQueryString(obj) {
      const params = new URLSearchParams();
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params.append(key, obj[key]);
        }
      }
      return params.toString();
    },
    findReapItem(tokens) {
      return tokens.find((token) => token.denom === "areap");
    },
    formatToken(v) {
      return formatToken(v, this.IBCDenom, 2);
    },
  },
};
</script>
