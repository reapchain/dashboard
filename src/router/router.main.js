import VueRouter from "vue-router";

const routerMain = new VueRouter({
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
      path: "/account/:address/receive",
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
      path: "/staking",
      name: "staking",
      component: () => import("@/views/Staking.vue"),
      meta: {
        pageTitle: "Staking",
        breadcrumb: [
          {
            text: "Staking",
            active: true,
          },
        ],
      },
    },
    {
      path: "/staking/:address",
      name: "staking-valiator",
      component: () => import("@/views/StakingValidator.vue"),
      meta: {
        pageTitle: "Validator Details",
        breadcrumb: [
          {
            text: "Staking",
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
      path: "/gov",
      name: "governance",
      component: () => import("@/views/Governance.vue"),
      meta: {
        pageTitle: "Governance",
        breadcrumb: [
          {
            text: "Governance",
            active: true,
          },
          {
            text: "Proposals",
            active: true,
          },
        ],
      },
    },
    {
      path: "/gov/:proposalid",
      name: "proposal",
      component: () => import("@/views/GovernanceProposalView.vue"),
      meta: {
        pageTitle: "Governance",
        breadcrumb: [
          {
            text: "Governance",
            active: true,
          },
          {
            text: "Proposal Detail",
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
    {
      path: "/cosmos/trade",
      name: "gravity",
      component: () => import("@/views/GravityPool.vue"),
      meta: {
        pageTitle: "Gravity Pools",
        breadcrumb: [
          {
            text: "Gravity",
            active: true,
          },
        ],
      },
    },
    // 2. OSMOSIS
    {
      path: "/osmosis/trade/:poolid?",
      name: "osmosis-trade",
      component: () => import("@/views/OsmosisTrade.vue"),
      meta: {
        pageTitle: "Classic Trade",
        breadcrumb: [
          {
            text: "DEX",
            active: true,
          },
          {
            text: "Classic Trade",
            active: true,
          },
        ],
      },
    },
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
      path: "/index.php",
      redirect: "/",
    },
    {
      path: "*",
      redirect: "/error/error-404",
    },
  ],
});

export default routerMain;
