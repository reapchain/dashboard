import { sha256 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import { ethToReap } from "../../libs/metamask/addressConverter";
import { networkInfo } from "/env/reapchain.config";

let chains = {};
chains[networkInfo.chain_name] = networkInfo;

const selected = chains[networkInfo.chain_name];
const avatarcache = localStorage.getItem("avatars");

localStorage.setItem("chains", JSON.stringify(chains));

export default {
  namespaced: true,
  state: {
    config: chains,
    selected: selected,
    avatars: avatarcache ? JSON.parse(avatarcache) : {},
    height: 0,
    ibcChannels: {},
    quotes: {},
    defaultWallet: localStorage.getItem("default-wallet"),
    denoms: {},
    ibcPaths: {},
  },
  getters: {
    getchains: (state) => state.chains,
    getAvatarById: (state) => (id) => state.avatars[id],
  },
  mutations: {
    setup_sdk_version(state, info) {
      state.chains.config[info.chain_name].sdk_version = info.version;
    },
    select(state, args) {
      state.chains.selected = state.chains.config[args.chain_name];
    },
    cacheAvatar(state, args) {
      state.chains.avatars[args.identity] = args.url;
      localStorage.setItem("avatars", JSON.stringify(state.chains.avatars));
    },
    setHeight(state, height) {
      state.chains.height = height;
    },
    setChannels(state, { chain, channels }) {
      state.chains.ibcChannels[chain] = channels;
    },
    setQuotes(state, quotes) {
      state.quotes = quotes;
    },
    setDefaultWallet(state, defaultWallet) {
      if (defaultWallet && defaultWallet.length > 0) {
        let walletType;
        if (defaultWallet.substring(0, 2) == "0x") {
          walletType = "metamask";
          defaultWallet = ethToReap(defaultWallet);
        } else {
          walletType = "keplr";
        }
        localStorage.setItem("default-wallet", defaultWallet);

        const accounts = {
          [defaultWallet]: {
            name: defaultWallet,
            device: walletType,
            address: [
              {
                chain: selected.chain_name || "reapchain",
                addr: defaultWallet,
                logo: "/logos/reapchain_logo.png",
                hdpath: "m/44'/60/0'/0/0",
              },
            ],
          },
        };
        const accountString = JSON.stringify(accounts);
        localStorage.setItem("accounts", accountString);
      } else {
        localStorage.setItem("default-wallet", "");
        localStorage.setItem("accounts", "");
      }
      state.chains.defaultWallet = defaultWallet;
    },
    setIBCDenoms(state, denoms) {
      state.denoms = { ...state.denoms, ...denoms };
    },
    setIBCPaths(state, paths) {
      state.ibcPaths = paths;
    },
  },
  actions: {
    async getQuotes(context) {},

    async getAllIBCDenoms(context, _this) {
      _this.$http.getAllIBCDenoms().then((x) => {
        const denomsMap = {};
        const pathsMap = {};
        x.denom_traces.forEach((trace) => {
          const hash = toHex(
            sha256(
              new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)
            )
          );
          const ibcDenom = `ibc/${hash.toUpperCase()}`;
          denomsMap[ibcDenom] = trace.base_denom;

          const path = trace.path.split("/");
          if (path.length >= 2) {
            pathsMap[ibcDenom] = {
              channel_id: path[path.length - 1],
              port_id: path[path.length - 2],
            };
          }
        });
        context.commit("setIBCDenoms", denomsMap);
        context.commit("setIBCPaths", pathsMap);
      });
    },
  },
};
