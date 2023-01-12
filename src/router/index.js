import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import { chainInfo } from "@/chains/config/reapchain.config";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/dashboard",
      component: () => import("@/views/Home.vue"),
      meta: {
        layout: "full",
        pageTitle: "Home",
        breadcrumb: [
          {
            text: "Home",
            active: true,
          },
        ],
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      alias: "/dashboard",
      component: () => import("@/views/Dashboard.vue"),
      meta: {
        pageTitle: "Dashboard",
        breadcrumb: [
          {
            text: "Dashboard",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/accounts",
      alias: "/wallet",
      name: "accounts",
      component: () => import("@/views/WalletAccounts.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/import",
      name: "accounts-import",
      component: () => import("@/views/WalletAccountImportAddress.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Import",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/delegations",
      name: "delegations",
      component: () => import("@/views/WalletDelegations.vue"),
      meta: {
        pageTitle: "My Delegations",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "My Delegations",
          },
        ],
      },
    },
    {
      path: "/wallet/transactions",
      name: "mytransactions",
      component: () => import("@/views/WalletTransactions.vue"),
      meta: {
        pageTitle: "Transaction History",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "Transaction History",
          },
        ],
      },
    },
    {
      path: "/wallet/votes",
      name: "myVotes",
      component: () => import("@/views/WalletVotes.vue"),
      meta: {
        pageTitle: "My Votes",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "My Votes",
          },
        ],
      },
    },
    {
      path: "/parameters",
      name: "parameters",
      alias: "/parameters",
      component: () => import("@/views/Parameters.vue"),
      meta: {
        pageTitle: "Parameters",
        breadcrumb: [
          {
            text: "Parameters",
            active: true,
          },
        ],
      },
    },
    {
      path: "/statesync",
      name: "statesync",
      component: () => import("@/views/StateSync.vue"),
      meta: {
        pageTitle: "State Sync",
        breadcrumb: [
          {
            text: "State Synchronization",
            active: true,
          },
        ],
      },
    },
    {
      path: "/uptime",
      name: "uptime",
      component: () => import("@/views/Uptime.vue"),
      meta: {
        pageTitle: "Uptime",
        breadcrumb: [
          {
            text: "Uptime",
            active: true,
          },
        ],
      },
    },
    {
      path: "/uptime/my",
      name: "myuptime",
      component: () => import("@/views/UptimeMyValidators.vue"),
      meta: {
        pageTitle: "Uptime",
        breadcrumb: [
          {
            text: "Uptime",
            active: true,
          },
          {
            text: "My Validators",
            active: true,
          },
        ],
      },
    },
    {
      path: "/account/:address",
      name: "chain-account",
      component: () => import("@/views/WalletAccountDetail.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Detail",
            active: true,
          },
        ],
      },
    },
    {
      path: "/account/address/:address",
      name: "chain-account-eth",
      component: () => import("@/views/WalletAccountDetail.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Detail",
            active: true,
          },
        ],
      },
    },
    {
      path: "/:chain/account/:address/receive",
      name: "chain-receive",
      component: () => import("@/views/WalletAccountReceive.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Pay Me",
            active: true,
          },
        ],
      },
    },
    {
      path: "/validators",
      name: "validators",
      component: () => import("@/views/Staking.vue"),
      meta: {
        pageTitle: "Validators",
        breadcrumb: [
          {
            text: "Validators",
            active: true,
          },
        ],
      },
    },
    {
      path: "/validators/:address",
      name: "validators-valiator",
      component: () => import("@/views/StakingValidator.vue"),
      meta: {
        pageTitle: "Validator Details",
        breadcrumb: [
          {
            text: "Validator",
            active: true,
          },
          {
            text: "Validator Details",
            active: true,
          },
        ],
      },
    },
    {
      path: "/blocks",
      name: "blocks",
      component: () => import("@/views/Blocks.vue"),
      meta: {
        pageTitle: "Blocks",
        breadcrumb: [
          {
            text: "Blocks",
            active: true,
          },
        ],
      },
    },
    {
      path: "/blocks/:height",
      name: "block",
      component: () => import("@/views/Block.vue"),
      meta: {
        pageTitle: "Block",
        breadcrumb: [
          {
            text: "Blocks",
            active: true,
          },
          {
            text: "Block",
            active: true,
          },
        ],
      },
    },
    {
      path: "/tx/:hash",
      name: "transaction",
      component: () => import("@/views/Transaction.vue"),
      meta: {
        pageTitle: "Transaction",
        breadcrumb: [
          {
            text: "Transaction",
            active: true,
          },
        ],
      },
    },
    // custom modules for specified chains
    // 1. cosmos
    // {
    //   path: "/cosmos/trade",
    //   name: "gravity",
    //   component: () => import("@/views/GravityPool.vue"),
    //   meta: {
    //     pageTitle: "Gravity Pools",
    //     breadcrumb: [
    //       {
    //         text: "Gravity",
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    // 2. OSMOSIS
    // {
    //   path: "/osmosis/trade/:poolid?",
    //   name: "osmosis-trade",
    //   component: () => import("@/views/OsmosisTrade.vue"),
    //   meta: {
    //     pageTitle: "Classic Trade",
    //     breadcrumb: [
    //       {
    //         text: "DEX",
    //         active: true,
    //       },
    //       {
    //         text: "Classic Trade",
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    // common modules
    {
      path: "/error/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/error/chain-not-exists",
      name: "chain-404",
      component: () => import("@/views/error/ChainNotExist.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "/error/error-404",
    },
  ],
});

const router_main = new VueRouter({
  mode: "history",
  base: "",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/dashboard",
      component: () => import("@/views/Home.vue"),
      meta: {
        layout: "full",
        pageTitle: "Home",
        breadcrumb: [
          {
            text: "Home",
            active: true,
          },
        ],
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      alias: "/dashboard",
      component: () => import("@/views/Dashboard.vue"),
      meta: {
        pageTitle: "Dashboard",
        breadcrumb: [
          {
            text: "Dashboard",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/accounts",
      alias: "/wallet",
      name: "accounts",
      component: () => import("@/views/WalletAccounts.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/import",
      name: "accounts-import",
      component: () => import("@/views/WalletAccountImportAddress.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Import",
            active: true,
          },
        ],
      },
    },
    {
      path: "/wallet/delegations",
      name: "delegations",
      component: () => import("@/views/WalletDelegations.vue"),
      meta: {
        pageTitle: "My Delegations",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "My Delegations",
          },
        ],
      },
    },
    {
      path: "/wallet/transactions",
      name: "mytransactions",
      component: () => import("@/views/WalletTransactions.vue"),
      meta: {
        pageTitle: "Transaction History",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "Transaction History",
          },
        ],
      },
    },
    {
      path: "/wallet/votes",
      name: "myVotes",
      component: () => import("@/views/WalletVotes.vue"),
      meta: {
        pageTitle: "My Votes",
        breadcrumb: [
          {
            text: "Wallet",
          },
          {
            text: "My Votes",
          },
        ],
      },
    },
    {
      path: "/parameters",
      name: "parameters",
      alias: "/parameters",
      component: () => import("@/views/Parameters.vue"),
      meta: {
        pageTitle: "Parameters",
        breadcrumb: [
          {
            text: "Parameters",
            active: true,
          },
        ],
      },
    },
    {
      path: "/statesync",
      name: "statesync",
      component: () => import("@/views/StateSync.vue"),
      meta: {
        pageTitle: "State Sync",
        breadcrumb: [
          {
            text: "State Synchronization",
            active: true,
          },
        ],
      },
    },
    {
      path: "/uptime",
      name: "uptime",
      component: () => import("@/views/Uptime.vue"),
      meta: {
        pageTitle: "Uptime",
        breadcrumb: [
          {
            text: "Uptime",
            active: true,
          },
        ],
      },
    },
    {
      path: "/uptime/my",
      name: "myuptime",
      component: () => import("@/views/UptimeMyValidators.vue"),
      meta: {
        pageTitle: "Uptime",
        breadcrumb: [
          {
            text: "Uptime",
            active: true,
          },
          {
            text: "My Validators",
            active: true,
          },
        ],
      },
    },
    {
      path: "/account/:address",
      name: "chain-account",
      component: () => import("@/views/WalletAccountDetail.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Detail",
            active: true,
          },
        ],
      },
    },
    {
      path: "/account/address/:address",
      name: "chain-account-eth",
      component: () => import("@/views/WalletAccountDetail.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Detail",
            active: true,
          },
        ],
      },
    },
    {
      path: "/:chain/account/:address/receive",
      name: "chain-receive",
      component: () => import("@/views/WalletAccountReceive.vue"),
      meta: {
        pageTitle: "Accounts",
        breadcrumb: [
          {
            text: "Accounts",
            active: true,
          },
          {
            text: "Pay Me",
            active: true,
          },
        ],
      },
    },
    {
      path: "/blocks",
      name: "blocks",
      component: () => import("@/views/Blocks.vue"),
      meta: {
        pageTitle: "Blocks",
        breadcrumb: [
          {
            text: "Blocks",
            active: true,
          },
        ],
      },
    },
    {
      path: "/blocks/:height",
      name: "block",
      component: () => import("@/views/Block.vue"),
      meta: {
        pageTitle: "Block",
        breadcrumb: [
          {
            text: "Blocks",
            active: true,
          },
          {
            text: "Block",
            active: true,
          },
        ],
      },
    },
    {
      path: "/tx/:hash",
      name: "transaction",
      component: () => import("@/views/Transaction.vue"),
      meta: {
        pageTitle: "Transaction",
        breadcrumb: [
          {
            text: "Transaction",
            active: true,
          },
        ],
      },
    },
    // custom modules for specified chains
    // 1. cosmos
    // {
    //   path: "/cosmos/trade",
    //   name: "gravity",
    //   component: () => import("@/views/GravityPool.vue"),
    //   meta: {
    //     pageTitle: "Gravity Pools",
    //     breadcrumb: [
    //       {
    //         text: "Gravity",
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    // 2. OSMOSIS
    // {
    //   path: "/osmosis/trade/:poolid?",
    //   name: "osmosis-trade",
    //   component: () => import("@/views/OsmosisTrade.vue"),
    //   meta: {
    //     pageTitle: "Classic Trade",
    //     breadcrumb: [
    //       {
    //         text: "DEX",
    //         active: true,
    //       },
    //       {
    //         text: "Classic Trade",
    //         active: true,
    //       },
    //     ],
    //   },
    // },
    // common modules
    {
      path: "/error/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/error/chain-not-exists",
      name: "chain-404",
      component: () => import("@/views/error/ChainNotExist.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "/error/error-404",
    },
  ],
});

const tempRouter = chainInfo.env === "main" ? router_main : router;

tempRouter.beforeEach((to, from, next) => {
  const c = to.params.chain;
  if (c) {
    store.commit("select", { chain_name: c });
    store.dispatch("chains/getAllIBCDenoms", Vue.prototype);
  }

  const config = JSON.parse(localStorage.getItem("chains"));
  // const has = Object.keys(config).findIndex(i => i === c)
  if (!config || Object.keys(config).findIndex((i) => i === c) > -1) {
    next();
  } else if (c) {
    // if (c === "index.php") {
    //   next({ name: "/" });
    // }
    // else {
    //   next({ name: "chain-404" });
    // }
  } else {
    next();
  }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
tempRouter.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default tempRouter;
