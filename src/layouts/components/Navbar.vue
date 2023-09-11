<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-lg-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <b-avatar
            v-if="selected_chain && selected_chain.logo"
            variant="transparent"
            rounded
            size="21"
            :src="selected_chain.logo"
            class="badge-minimal"
          />
          <feather-icon v-else icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <b-media v-if="selected_chain" no-body>
        <b-media-aside class="mr-75">
          <b-link class="nav-link" @click="toggleVerticalMenuActive">
            <b-avatar
              v-b-tooltip.hover.bottom="tips"
              variant="transparent"
              badge
              rounded
              size="42"
              :src="'/reapchain_bg_logo.png'"
              class="badge-minimal"
              :badge-variant="variant"
          /></b-link>
        </b-media-aside>
        <b-media-body class="my-auto">
          <h6 class="mb-0 ">
            <span class="text-uppercase">{{
              chainid || selected_chain.chain_name
            }}</span>
          </h6>
          <small id="data-provider">
            {{ currentApi }} ({{ selected_chain.sdk_version || "-" }})
            <b-dropdown
              class="ml-0"
              variant="flat-primary"
              no-caret
              toggle-class="p-0"
              right
              sm
            >
              <template #button-content>
                <feather-icon
                  icon="RepeatIcon"
                  size="12"
                  class="cursor-pointer"
                />
              </template>
              <b-dropdown-item
                v-for="(item, i) in apiOptions"
                :key="item"
                @click="change(i)"
              >
                {{ item }}
              </b-dropdown-item>
            </b-dropdown>
          </small>
        </b-media-body>
      </b-media>
    </div>

    <!-- Connect with wallet -->
    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler class="d-none d-lg-block" />
      <search-bar />
      <!-- <locale /> -->
      <b-dropdown class="ml-1" variant="link" no-caret toggle-class="p-0" right>
        <template #button-content>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="btn-icon"
          >
            <template v-if="!wallet.isConnected">
              <feather-icon icon="LinkIcon" />
              Connect Wallet
            </template>
            <template v-else-if="wallet.isConnected && wallet.type == 'keplr'">
              <img
                src="@/assets/images/wallet/keplr-logo.svg"
                width="20"
                alt="keplr"
              />
              {{ `${wallet.name} - ${wallet.addressAbbr}` }}
            </template>
            <template
              v-else-if="wallet.isConnected && wallet.type == 'metamask'"
            >
              <img
                src="@/assets/images/wallet/metamask-logo.svg"
                width="20"
                alt="metamask"
              />
              {{ `${wallet.addressAbbr}` }}
            </template>
          </b-button>
        </template>

        <template v-if="!wallet.isConnected">
          <b-dropdown-item @click="connectWithKeplr">
            <img
              src="@/assets/images/wallet/keplr-logo.svg"
              width="20"
              alt="keplr"
            />
            <span class="align-middle ml-50">With Keplr</span>
          </b-dropdown-item>
          <b-dropdown-item @click="connectWithMetamask">
            <img
              src="@/assets/images/wallet/metamask-logo.svg"
              width="20"
              alt="metamask"
            />
            <span class="align-middle ml-50">With Metamask</span>
          </b-dropdown-item>
        </template>
        <template v-else>
          <b-dropdown-item
            v-if="wallet.type == 'keplr'"
            @click="handleMyAccount"
          >
            <feather-icon icon="KeyIcon" size="16" />
            <span class="align-middle ml-50">My Account</span>
          </b-dropdown-item>
          <b-dropdown-item
            v-else-if="wallet.type == 'metamask'"
            :to="`/account/${wallet.addressBech32}`"
          >
            <feather-icon icon="KeyIcon" size="16" />
            <span class="align-middle ml-50">My Account</span>
          </b-dropdown-item>
          <b-dropdown-item :to="`/wallet/transactions`" v-if="false">
            <feather-icon icon="LayersIcon" size="16" />
            <span class="align-middle ml-50">My Transactions</span>
          </b-dropdown-item>

          <b-dropdown-item @click="disconnectWallet">
            <feather-icon icon="LogOutIcon" size="16" />
            <span class="align-middle ml-50">Disconnect</span>
          </b-dropdown-item>
        </template>
      </b-dropdown>
    </b-navbar-nav>

    <!-- <dark-Toggler class="d-none d-lg-block" /> -->
    <!-- Right Col -->
    <b-navbar-nav class="nav align-items-center ml-auto" v-if="false">
      <dark-Toggler class="d-none d-lg-block" />
      <search-bar />
      <locale />
      <b-dropdown class="ml-1" variant="link" no-caret toggle-class="p-0" right>
        <template #button-content>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="btn-icon"
          >
            <feather-icon icon="KeyIcon" />
            {{ walletName }}
          </b-button>
        </template>

        {{ accounts }}

        <b-dropdown-item
          v-for="(item, k) in accounts"
          :key="k"
          :disabled="!item.address"
          @click="updateDefaultWallet(item.wallet)"
        >
          <div class="d-flex flex-column">
            <span class="font-weight-bolder"
              >{{ item.wallet }}
              <b-avatar
                v-if="item.wallet === walletName"
                variant="success"
                size="sm"
              >
                <feather-icon icon="CheckIcon" />
              </b-avatar>
            </span>
            <small>{{
              item.address
                ? formatAddr(item.address.addr)
                : `Not available on ${selected_chain.chain_name}`
            }}</small>
          </div>
        </b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item to="/wallet/import">
          <feather-icon icon="PlusIcon" size="16" />
          <span class="align-middle ml-50">Import Address</span>
        </b-dropdown-item>
        <b-dropdown-divider />

        <b-dropdown-item :to="{ name: 'accounts' }">
          <feather-icon icon="KeyIcon" size="16" />
          <span class="align-middle ml-50">Accounts</span>
        </b-dropdown-item>

        <b-dropdown-item :to="{ name: 'delegations' }">
          <feather-icon icon="BookOpenIcon" size="16" />
          <span class="align-middle ml-50">My Delegations</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/${selected_chain.chain_name}/uptime/my`">
          <feather-icon icon="AirplayIcon" size="16" />
          <span class="align-middle ml-50">My Validators</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/wallet/votes`">
          <feather-icon icon="PocketIcon" size="16" />
          <span class="align-middle ml-50">My Votes</span>
        </b-dropdown-item>

        <b-dropdown-item :to="`/wallet/transactions`">
          <feather-icon icon="LayersIcon" size="16" />
          <span class="align-middle ml-50">My Transactions</span>
        </b-dropdown-item>
      </b-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink,
  BNavbarNav,
  BMedia,
  BMediaAside,
  BAvatar,
  BMediaBody,
  VBTooltip,
  BButton,
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import DarkToggler from "@core/layouts/components/app-navbar/components/DarkToggler.vue";
import Locale from "@core/layouts/components/app-navbar/components/Locale.vue";
import SearchBar from "@core/layouts/components/app-navbar/components/SearchBar.vue";
// import CartDropdown from '@core/layouts/components/app-navbar/components/CartDropdown.vue'
import { getLocalAccounts, timeIn, toDay } from "@/libs/utils";
// import UserDropdown from '@core/layouts/components/app-navbar/components/UserDropdown.vue'
import { connectKeplrWallet, initKeplr } from "@/libs/keplr/keplr";
import { connectMetamaskWallet } from "@/libs/metamask/utils";
import { ethToReap } from "@/libs/metamask/addressConverter";
import { chainInfo } from "@/chains/config/reapchain.config";

export default {
  components: {
    BLink,
    BNavbarNav,
    BAvatar,
    BMedia,
    BMediaAside,
    BMediaBody,
    BButton,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,

    // Navbar Components
    DarkToggler,
    Locale,
    SearchBar,
    // CartDropdown,
    // UserDropdown,
  },
  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      variant: "success",
      tips: "Synced",
      index: 0,
      chainid: "",
      chainInfo,
      wallet: {
        isConnected: false,
        name: "",
        type: "",
        address: "",
        pubkey: "",
      },
    };
  },
  computed: {
    walletName() {
      const key = this.$store?.state?.chains?.defaultWallet;
      return key || "Wallet";
    },
    selected_chain() {
      this.block();
      return this.$store.state.chains.selected;
    },
    chainVariant() {
      return this.variant;
    },
    currentApi() {
      return this.index + 1 > this.apiOptions.length
        ? this.apiOptions[0]
        : this.apiOptions[this.index];
    },
    apiOptions() {
      const conf = this.$store.state.chains.selected;
      if (Array.isArray(conf.api)) {
        return conf.api;
      }
      return [conf.api];
    },
    accounts() {
      let accounts = getLocalAccounts() || {};
      accounts = Object.entries(accounts).map((v) => ({
        wallet: v[0],
        address: v[1].address.find(
          (x) => x.chain === this.selected_chain.chain_name
        ),
      }));

      if (accounts.length > 0) {
        this.updateDefaultWallet(accounts[0].wallet);
      }
      return accounts.filter((x) => x.address);
    },
  },
  mounted() {
    const walletTypeCheck = localStorage.getItem("walletType");
    if (walletTypeCheck === "keplr") {
      this.connectWithKeplr();
    } else if (walletTypeCheck === "metamask") {
      this.connectWithMetamask();
    }
  },
  methods: {
    handleMyAccount() {
      this.$router.replace(`/account/${this.wallet.address}`).catch(() => {});
    },
    async connectWithKeplr() {
      const myAccount = await connectKeplrWallet();
      if (myAccount) {
        this.wallet = {
          isConnected: true,
          type: "keplr",
          name: myAccount.name,
          address: myAccount.bech32Address,
          addressAbbr: `${myAccount.bech32Address.substring(
            0,
            10
          )}...${myAccount.bech32Address.substring(
            myAccount.bech32Address.length - 6
          )}`,
        };
        localStorage.setItem("walletType", "keplr");
        this.updateDefaultWallet(this.wallet.address);
      }
      window.addEventListener("keplr_keystorechange", () => {
        this.connectWithKeplr();
      });
    },
    async connectWithMetamask() {
      const myAccount = await connectMetamaskWallet();

      if (!myAccount) {
        return;
      }

      if (myAccount) {
        this.wallet = {
          isConnected: true,
          type: "metamask",
          name: "",
          address: myAccount[0],
          addressBech32: ethToReap(myAccount[0]),
          addressAbbr: `${myAccount[0].substring(
            0,
            10
          )}...${myAccount[0].substring(myAccount[0].length - 6)}`,
        };
        localStorage.setItem("walletType", "metamask");
      }
      this.updateDefaultWallet(this.wallet.address);
      window.ethereum.on("accountsChanged", () => {
        this.connectWithMetamask();
      });
    },
    disconnectWallet() {
      this.wallet = {
        isConnected: false,
        name: "",
        type: "",
        address: "",
        pubkey: "",
      };
      window.removeEventListener("keplr_keystorechange", () => {});
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => {});
      }
      localStorage.setItem("walletType", "");
      this.updateDefaultWallet("");
    },
    formatAddr(v) {
      return v.substring(0, 10).concat("...", v.substring(v.length - 10));
    },
    updateDefaultWallet(v) {
      this.$store.commit("setDefaultWallet", v);
    },
    change(v) {
      this.index = v;
      const conf = this.$store.state.chains.selected;
      localStorage.setItem(`${conf.chain_name}-api-index`, v);
      window.location.reload();
    },
    block() {
      const conf = this.$store.state.chains.selected;
      const s = localStorage.getItem(`${conf.chain_name}-api-index`) || 0;
      this.index = Number(s);
      this.$store.commit("setHeight", 0);
      this.$http.getLatestBlock().then((block) => {
        this.chainid = block.block.header.chain_id;
        this.$store.commit("setHeight", Number(block.block.header.height));
        if (timeIn(block.block.header.time, 1, "m")) {
          this.variant = "danger";
          this.tips = `Halted ${toDay(
            block.block.header.time,
            "from"
          )}, Height: ${this.$store.state.chains.height} `;
        } else {
          this.variant = "success";
          this.tips = "Synced";
        }
      });
    },
  },
};
</script>
