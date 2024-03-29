import fetch from "node-fetch";
import store from "@/store";
import compareVersions from "compare-versions";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { toBase64 } from "@cosmjs/encoding";
import {
  Proposal,
  ProposalTally,
  Proposer,
  StakingPool,
  Votes,
  Deposit,
  Validator,
  StakingParameters,
  Block,
  ValidatorDistribution,
  StakingDelegation,
  WrapStdTx,
  getUserCurrency,
  isTypeofEvmos,
} from "./utils";
import OsmosAPI from "./osmos";
import {
  validatorsDummy,
  validatorsUnbondedDummy,
  validatorsUnbondingDummy,
} from "./testdata";
import { ethToReap } from "./metamask/addressConverter";
import coinoneAxios from "./common/coinone";
import gateioAxios from "./common/gateio";
import chartProxy from "./common/chartProxy";
import {
  MIN_STANDING_BOND_AMOUNT,
  MIN_VALIDATOR_BOND_AMOUNT,
} from "@/libs/config";

function commonProcess(res) {
  if (res && Object.keys(res).includes("result")) {
    return res.result;
  }
  return res;
}

// 头像
export function keybase(identity) {
  return fetch(
    `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`
  ).then((res) => res.json());
}

const validatorFilter = (
  validatorList,
  condition = { type: "", active: "active" }
) => {
  if (condition.type === "standing") {
    if (condition.active === "active") {
      return validatorList.filter(
        (ele) =>
          ele.type === "standing" &&
          ele.tokens >= MIN_STANDING_BOND_AMOUNT &&
          ele.jailed == false
      );
    } else {
      return validatorList.filter(
        (ele) =>
          ele.type === "standing" &&
          (ele.jailed == true || ele.tokens < MIN_STANDING_BOND_AMOUNT)
      );
    }
  } else if (condition.type === "steering") {
    if (condition.active === "active") {
      return validatorList.filter(
        (ele) =>
          ele.type === "steering" &&
          ele.tokens >= MIN_VALIDATOR_BOND_AMOUNT &&
          ele.jailed == false
      );
    } else {
      return validatorList.filter(
        (ele) =>
          ele.type === "steering" &&
          (ele.jailed == true || ele.tokens < MIN_VALIDATOR_BOND_AMOUNT)
      );
    }
  } else {
    if (condition.active === "active") {
      return validatorList.filter(
        (ele) =>
          ele.jailed == false &&
          ((ele.type === "standing" &&
            ele.tokens >= MIN_STANDING_BOND_AMOUNT) ||
            (ele.type === "steering" &&
              ele.tokens >= MIN_VALIDATOR_BOND_AMOUNT))
      );
    } else {
      return validatorList.filter(
        (ele) =>
          ele.jailed == true ||
          (ele.type === "standing" && ele.tokens < MIN_STANDING_BOND_AMOUNT) ||
          (ele.type === "steering" && ele.tokens < MIN_VALIDATOR_BOND_AMOUNT)
      );
    }
  }
};

export default class ChainFetch {
  getSelectedConfig() {
    let chain = store.state.chains.selected;
    const lschains = localStorage.getItem("chains");

    if (lschains) {
      chain = JSON.parse(lschains)[chain.chain_name];
    }
    if (!chain.sdk_version) {
      chain.sdk_version = "0.33";
    }
    this.config = chain;
    return this.config;
  }

  isModuleLoaded(name) {
    if (this.config.unload_module) {
      return !this.config.unload_module.includes(name);
    }
    return true;
  }

  async getNodeInfo() {
    return this.get("/cosmos/base/tendermint/v1beta1/node_info");
  }

  async getLatestBlock(config = null) {
    return this.get(
      `/blocks/latest?${new Date().getTime()}`,
      config
    ).then((data) => Block.create(data));
  }

  async getLatestBlockData(config = null) {
    const latestBlock = await this.get(
      `/blocks/latest?${new Date().getTime()}`,
      config
    );
    return Block.create(latestBlock);
  }

  async getAllAccounts(queryString = "") {
    return this.get(`/cosmos/auth/v1beta1/accounts?${queryString}`).then(
      (data) => data
    );
  }

  async getBlockByHeight(height, config = null) {
    const conf = config || this.getSelectedConfig();
    return this.get(`/blocks/${height}`, config).then((data) =>
      Block.create(data)
    );
  }

  async getCurrentValset(height, config = null) {
    const conf = config || this.getSelectedConfig();
    return this.get(`/gravity/v1beta/valset/current`, config).then(
      (data) => data
    );
  }

  async getBlockByHeight2(height) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      _this
        .get(`/blocks/${height}`)
        .then((data) => resolve(Block.create(data)));
    });

    const block = await promise;
    return block;
  }

  async getSlashingSigningInfo(config = null) {
    return this.get(
      "/cosmos/slashing/v1beta1/signing_infos?pagination.limit=500",
      config
    );
  }

  async getTxs(hash, config = null) {
    const conf = config || this.getSelectedConfig();
    const ver = conf.sdk_version || "0.41";
    // /cosmos/tx/v1beta1/txs/{hash}
    if (ver && compareVersions(ver, "0.40") < 1) {
      return this.get(`/txs/${hash}`).then((data) =>
        WrapStdTx.create(data, ver)
      );
    }
    return this.get(`/cosmos/tx/v1beta1/txs/${hash}`).then((data) =>
      WrapStdTx.create(data, ver)
    );
  }

  async getTxsBySender(sender) {
    return this.get(
      `/cosmos/tx/v1beta1/txs?events=message.sender='${sender}'&pagination.reverse=true&order_by=ORDER_BY_DESC`
    );
  }

  async getTxsBySenderPagination(sender, page = 1, size = 10) {
    const limit = size;
    const offset = page * size - size;
    return this.get(
      `/cosmos/tx/v1beta1/txs?events=message.sender='${sender}'&pagination.reverse=true&order_by=ORDER_BY_DESC&pagination.limit=${limit}&pagination.offset=${offset}`
    );
  }

  async getTxsByRecipientPagination(recipient, page = 1, size = 10) {
    const limit = size;
    const offset = page * size - size;
    return this.get(
      `/cosmos/tx/v1beta1/txs?&pagination.reverse=true&events=coin_received.receiver='${recipient}'&pagination.limit=${limit}&pagination.offset=${offset}&pagination.count_total=true`
    );
  }

  async getTxsByRecipient(recipient) {
    return this.get(`/txs?message.recipient=${recipient}`);
  }

  async getTxsByHeight(height) {
    return this.get(`/cosmos/tx/v1beta1/txs?events=tx.height=${height}`);
  }

  async getValidatorDistribution(address) {
    return this.get(`/distribution/validators/${address}`).then((data) => {
      const ret = ValidatorDistribution.create(commonProcess(data));
      ret.versionFixed(this.config.sdk_version);
      return ret;
    });
  }

  async getStakingDelegatorDelegation(delegatorAddr, validatorAddr) {
    return this.get(
      `/staking/delegators/${delegatorAddr}/delegations/${validatorAddr}`
    ).then((data) => StakingDelegation.create(commonProcess(data)));
  }

  async getBankTotal(denom) {
    if (compareVersions(this.config.sdk_version, "0.40") < 0) {
      return this.get(`/supply/total/${denom}`).then((data) => ({
        amount: commonProcess(data),
        denom,
      }));
    }
    return this.get(`/bank/total/${denom}`).then((data) => commonProcess(data));
  }

  async getEpochMintProvision() {
    return this.get(
      `/reapchain/inflation/v1/epoch_mint_provision`
    ).then((data) => commonProcess(data));
  }

  async getCirculatingSupply() {
    return this.get(`/reapchain/inflation/v1/circulating_supply`).then((data) =>
      commonProcess(data)
    );
  }

  async getBankTotals() {
    if (compareVersions(this.config.sdk_version, "0.40") < 0) {
      return this.get("/supply/total").then((data) => commonProcess(data));
    }
    return this.get("/cosmos/bank/v1beta1/supply").then((data) => data.supply);
  }

  async getStakingPool() {
    return this.get("/staking/pool").then((data) =>
      new StakingPool().init(commonProcess(data))
    );
  }

  async getMintingInflation() {
    if (isTypeofEvmos(this.config.chain_name)) {
      // const data = await this.get("/cosmos/mint/v1beta1/inflation");
      const data = await this.get("/reapchain/inflation/v1/inflation_rate");
      return Number(data.inflation_rate / 100 || 0);
    }
    if (this.isModuleLoaded("minting")) {
      return this.get("/minting/inflation").then((data) =>
        Number(commonProcess(data))
      );
    }
    return 0;
  }

  async getStakingParameters() {
    return this.get("/staking/parameters").then((data) => {
      this.getSelectedConfig();
      return StakingParameters.create(
        commonProcess(data),
        this.config.chain_name
      );
    });
  }

  async getValidatorList(config = null) {
    return this.get("/cosmos/staking/v1beta1/validators", config).then(
      (data) => {
        const vals = commonProcess(data.validators).map((i) =>
          new Validator().init(i)
        );
        localStorage.setItem(
          `validators-${this.config.chain_name}`,
          JSON.stringify(vals)
        );
        return vals;
      }
    );
  }

  async getValidatorList_filter(config = null) {
    try {
      const validatorsBonded = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
      );
      const validatorsUnbonding = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_UNBONDING"
      );
      const validatorsUnbonded = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_UNBONDED"
      );
      const validatorsAll = validatorsBonded.validators
        .concat(validatorsUnbonding.validators)
        .concat(validatorsUnbonded.validators);
      const validatorActive = validatorFilter(validatorsAll, {
        type: "",
        active: "active",
      });
      const vals = commonProcess(validatorActive).map((i) =>
        new Validator().init(i)
      );
      localStorage.setItem(
        `validators-${this.config.chain_name}`,
        JSON.stringify(vals)
      );
      return vals;
    } catch (error) {
      console.log(error);
    }
  }

  async getValidatorUnbondedList() {
    return this.get(
      "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_UNBONDED"
    ).then((data) => {
      const result = commonProcess(data);
      const vals = result.validators ? result.validators : result;
      return vals.map((i) => new Validator().init(i));
    });
  }

  async getValidatorListByStatus_pre(status) {
    return this.get(
      `/cosmos/staking/v1beta1/validators?status=${status}&pagination.limit=500`
    ).then((data) => {
      if (status == "BOND_STATUS_UNBONDED") {
        data = validatorsUnbondedDummy;
      } else if (status == "BOND_STATUS_UNBONDING") {
        data = validatorsUnbondingDummy;
      }
      const result = commonProcess(data);
      const vals = result.validators ? result.validators : result;
      return vals.map((i) => new Validator().init(i));
    });
  }

  async getInactiveValidatorList() {
    try {
      const validatorsBonded = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
      );
      const validatorsUnbonding = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_UNBONDING"
      );
      const validatorsUnbonded = await this.get(
        "/cosmos/staking/v1beta1/validators?status=BOND_STATUS_UNBONDED"
      );
      // console.log(validatorsBonded, validatorsUnbonding, validatorsUnbonded);

      const validatorInactive = validatorsBonded.validators
        .concat(validatorsUnbonding.validators)
        .concat(validatorsUnbonded.validators);

      const result = commonProcess(validatorInactive);
      const vals = result.validators ? result.validators : result;
      return vals.map((i) => new Validator().init(i));
    } catch (error) {
      console.log(error);
    }
  }

  async getValidatorListByHeight(height, offset) {
    if (isTypeofEvmos(this.config.chain_name)) {
      return this.get(
        `/cosmos/base/reapchain/v1beta1/validatorsets/latest`
      ).then((data) => commonProcess(data));
    } else {
      return this.get(
        `/cosmos/base/tendermint/v1beta1/validatorsets/${height}?pagination.limit=100&pagination.offset=${offset}`
      ).then((data) => commonProcess(data));
    }
  }

  async getStakingValidator(address) {
    return this.get(
      `/cosmos/staking/v1beta1/validators/${address}`
    ).then(({ validator }) => new Validator().init(commonProcess(validator)));
  }

  async getSlashingParameters() {
    if (this.isModuleLoaded("slashing")) {
      return this.get("/slashing/parameters").then((data) =>
        commonProcess(data)
      );
    }
    return null;
  }

  async getMintParameters() {
    if (isTypeofEvmos(this.config.chain_name)) {
      // const result = await this.get("/reapchain/inflation/v1/params").then(
      const result = await this.get("/reapchain/inflation/v1/params").then(
        (data) => data.params
      );
      // await this.get("/reapchain/inflation/v1/period").then((data) => {
      await this.get("/reapchain/inflation/v1/period").then((data) => {
        Object.entries(data).forEach((x) => {
          const k = x[0];
          const v = x[1];
          result[k] = v;
        });
      });
      return result;
    }
    if (this.isModuleLoaded("minting")) {
      return this.get("/minting/parameters").then((data) =>
        commonProcess(data)
      );
    }
    return null;
  }

  async getDistributionParameters() {
    return this.get("/distribution/parameters").then((data) => {
      if (data) {
        delete data.result["community_tax"];
      }
      return commonProcess(data);
    });
  }

  async getPermissionParameters() {
    return this.get("/reapchain/permissions/v1/params").then((data) => {
      const result = commonProcess(data);
      if (result) {
        return {
          Initial_min_deposit_percentage:
            result.params.gov_min_initial_deposit_percentage,
        };
      } else {
        return result;
      }
    });
  }

  async getGovernanceParameterDeposit() {
    return this.get("/gov/parameters/deposit").then((data) =>
      commonProcess(data)
    );
  }

  async getGovernanceParameterTallying() {
    return this.get("/gov/parameters/tallying").then((data) =>
      commonProcess(data)
    );
  }

  async getGovernanceParameterVoting() {
    return this.get("/gov/parameters/voting").then((data) =>
      commonProcess(data)
    );
  }

  async getGovernanceTally(pid, total, conf) {
    return this.get(`/gov/proposals/${pid}/tally`, conf).then((data) =>
      new ProposalTally().init(commonProcess(data), total)
    );
  }

  getGovernance(pid) {
    return this.get(`/gov/proposals/${pid}`).then((data) => {
      const p = new Proposal().init(commonProcess(data), 0);
      p.versionFixed(this.config.sdk_version);
      return p;
    });
  }

  async getGovernanceProposer(pid) {
    if (this.config.chain_name === "certik") {
      return this.get(`/shentu/gov/v1alpha1/${pid}/proposer`).then((data) =>
        new Proposer().init(commonProcess(data))
      );
    }
    return this.get(`/gov/proposals/${pid}/proposer`).then((data) =>
      new Proposer().init(commonProcess(data))
    );
  }

  async getGovernanceDeposits(pid) {
    if (this.config.chain_name === "certik") {
      return this.get(`/shentu/gov/v1alpha1/proposals/${pid}/deposits`).then(
        (data) => {
          const result = commonProcess(data);
          return Array.isArray(result)
            ? result.reverse().map((d) => new Deposit().init(d))
            : result;
        }
      );
    }
    return this.get(`/gov/proposals/${pid}/deposits`).then((data) => {
      const result = commonProcess(data);
      return Array.isArray(result)
        ? result.reverse().map((d) => new Deposit().init(d))
        : result;
    });
  }

  async getGovernanceVotes(pid, next = "", limit = 50) {
    if (compareVersions(this.config.sdk_version, "0.40") < 0) {
      return this.get(`/gov/proposals/${pid}/votes`).then((data) => ({
        votes: commonProcess(data).map((d) => new Votes().init(d)),
        pagination: {},
      }));
    }
    if (this.config.chain_name === "shentu") {
      return this.get(
        `/shentu/gov/v1alpha1/proposals/${pid}/votes?pagination.key=${encodeURIComponent(
          next
        )}&pagination.limit=${limit}&pagination.reverse=true`
      );
    }
    return this.get(
      `/cosmos/gov/v1beta1/proposals/${pid}/votes?pagination.key=${encodeURIComponent(
        next
      )}&pagination.limit=${limit}&pagination.reverse=true`
    );
  }

  async getGovernanceListByStatus(status, chain = null) {
    const conf = chain || this.config;
    const url =
      conf.chain_name === "shentu"
        ? `/shentu/gov/v1alpha1/proposals?pagination.limit=100&proposal_status=${status}`
        : `/cosmos/gov/v1beta1/proposals?pagination.limit=100&proposal_status=${status}`;
    return this.get(url, conf).then((data) => {
      let proposals = commonProcess(data);
      if (Array.isArray(proposals.proposals)) {
        proposals = proposals.proposals;
      }
      const ret = [];
      if (proposals) {
        proposals.forEach((e) => {
          const g = new Proposal().init(e, 0);
          g.versionFixed(this.config.sdk_version);
          ret.push(g);
        });
      }
      return {
        proposals: ret,
        pagination: data.pagination,
      };
    });
  }

  async getGovernanceProposalVote(pid, voter, chain) {
    const url =
      this.config.chain_name === "shentu"
        ? `/shentu/gov/v1alpha1/proposals/${pid}/votes/${voter}`
        : `/cosmos/gov/v1beta1/proposals/${pid}/votes/${voter}`;
    return this.get(url, chain).then((data) => {
      if (data.code === 3) {
        throw new Error("not found");
      }
      return data;
    });
  }

  /// does NOT return value as expected
  async getUpgradeCurrentPlan(chain = null) {
    return this.get("/cosmos/upgrade/v1beta1/current_plan", chain);
  }

  async getGovernanceList(next = "", chain = null) {
    const key = next || "";
    const url =
      this.config.chain_name === "shentu"
        ? `/shentu/gov/v1alpha1/proposals?pagination.limit=50&pagination.reverse=true&pagination.key=${key}`
        : `/cosmos/gov/v1beta1/proposals?pagination.limit=50&pagination.reverse=true&pagination.key=${key}`;
    return this.get(url, chain).then((data) => {
      // const pool = new StakingPool().init(commonProcess(data[1]))
      let proposals = commonProcess(data);
      if (Array.isArray(proposals.proposals)) {
        proposals = proposals.proposals;
      }
      const ret = [];
      if (proposals) {
        proposals.forEach((e) => {
          const g = new Proposal().init(e, 0);
          g.versionFixed(this.config.sdk_version);
          ret.push(g);
        });
      }
      return {
        proposals: ret,
        pagination: data.pagination,
      };
    });
  }

  async getAuthAccount(address, config = null) {
    return this.get("/auth/accounts/".concat(address), config).then((data) => {
      const result = commonProcess(data);
      return result.value ? result : { value: result };
    });
  }

  async getBankAccountBalance(address) {
    return this.get("/bank/balances/".concat(address)).then((data) =>
      commonProcess(data)
    );
  }

  async getStakingReward(address, config = null) {
    if (
      compareVersions(
        config ? config.sdk_version : this.config.sdk_version,
        "0.40"
      ) < 0
    ) {
      return this.get(
        `/distribution/delegators/${address}/rewards`,
        config
      ).then((data) => commonProcess(data));
    }
    return this.get(
      `/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
      config
    ).then((data) => commonProcess(data));
  }

  async getStakingValidators(address) {
    return this.get(
      `/cosmos/distribution/v1beta1/delegators/${address}/validators`
    ).then((data) => commonProcess(data));
  }

  async getStakingDelegations(address, config = null) {
    if (
      compareVersions(
        config ? config.sdk_version : this.config.sdk_version,
        "0.40"
      ) < 0
    ) {
      return this.get(
        `/staking/delegators/${address}/delegations`,
        config
      ).then((data) =>
        commonProcess(data).map((x) => {
          const xh = x;
          if (!xh.delegation) {
            xh.delegation = {
              validator_address: x.validator_address,
              delegator_address: x.delegator_address,
            };
          }
          return xh;
        })
      );
    }
    return this.get(
      `/cosmos/staking/v1beta1/delegations/${address}`,
      config
    ).then((data) => commonProcess(data));
  }

  async getStakingRedelegations(address, config = null) {
    if (
      compareVersions(
        config ? config.sdk_version : this.config.sdk_version,
        "0.40"
      ) < 0
    ) {
      return this.get(
        `/staking/redelegations?delegator=${address}`,
        config
      ).then((data) => commonProcess(data));
    }
    return this.get(
      `/cosmos/staking/v1beta1/delegators/${address}/redelegations`,
      config
    ).then((data) => commonProcess(data));
  }

  async getStakingUnbonding(address, config = null) {
    if (
      compareVersions(
        config ? config.sdk_version : this.config.sdk_version,
        "0.40"
      ) < 0
    ) {
      return this.get(
        `/staking/delegators/${address}/unbonding_delegations`,
        config
      ).then((data) => commonProcess(data));
    }
    return this.get(
      `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`,
      config
    ).then((data) => commonProcess(data));
  }

  async getBankBalances(address, config = null) {
    return this.get("/bank/balances/".concat(address), config).then((data) =>
      commonProcess(data)
    );
  }

  async getCommunityPool(config = null) {
    return this.get(
      "/cosmos/distribution/v1beta1/community_pool",
      config
    ).then((data) => commonProcess(data));
  }

  async getAllIBCDenoms(config = null) {
    const conf = config || this.getSelectedConfig();
    const sdkVersion = conf.sdk_version;
    if (compareVersions(sdkVersion, "0.44.2") < 0) {
      return this.get(
        "/ibc/applications/transfer/v1beta1/denom_traces?pagination.limit=500",
        conf
      ).then((data) => commonProcess(data));
    }
    return this.get(
      "/ibc/apps/transfer/v1/denom_traces?pagination.limit=500",
      conf
    ).then((data) => commonProcess(data));
  }

  async getIBCDenomTrace(hash, config = null) {
    const h = hash.substring(hash.indexOf("/") + 1);
    const sdkVersion = config ? config.sdk_version : this.config.sdk_version;
    if (compareVersions(sdkVersion, "0.44.2") < 0) {
      return this.get(
        "/ibc/applications/transfer/v1beta1/denom_traces/".concat(h),
        config
      ).then((data) => commonProcess(data));
    }
    return this.get(
      "/ibc/apps/transfer/v1/denom_traces/".concat(h),
      config
    ).then((data) => commonProcess(data));
  }

  async getIBCChannels(config = null, key = null) {
    if (key) {
      return this.get(
        "/ibc/core/channel/v1/channels?pagination.key=".concat(key),
        config
      ).then((data) => commonProcess(data));
    }
    return this.get(
      "/ibc/core/channel/v1/channels?pagination.limit=1000",
      config
    ).then((data) => commonProcess(data));
  }

  // eslint-disable-next-line camelcase
  async getIBCChannelClientState(channel_id, port_id, config = null) {
    // eslint-disable-next-line camelcase
    return this.get(
      `/ibc/core/channel/v1/channels/${channel_id}/ports/${port_id}/client_state`,
      config
    ).then((data) => commonProcess(data));
  }

  // eslint-disable-next-line camelcase
  async getIBCChannel(channel_id, port_id, config = null) {
    // eslint-disable-next-line camelcase
    return this.get(
      `/ibc/core/channel/v1/channels/${channel_id}/ports/${port_id}`,
      config
    ).then((data) => commonProcess(data));
  }

  static async getBankBalance(baseurl, address) {
    return ChainFetch.fetch(
      baseurl,
      "/bank/balances/".concat(address)
    ).then((data) => commonProcess(data));
  }

  async getGravityPools() {
    return this.get("/cosmos/liquidity/v1beta1/pools").then((data) =>
      commonProcess(data)
    );
  }

  async getCoinInfo() {
    return ChainFetch.fetch(
      "https://api.coingecko.com",
      `/api/v3/coins/reapchain`
    );
  }

  async getMarketChart(days = 14) {
    const conf = this.getSelectedConfig();
    return ChainFetch.fetch(
      "https://api.coingecko.com",
      `/api/v3/coins/reapchain/market_chart?vs_currency=usd&days=${days}`
    );
    return null;
  }

  // async getMarketChart(days = 14, coin = null) {
  //   const conf = this.getSelectedConfig();
  //   const currency = getUserCurrency();
  //   if (conf.assets[0] && conf.assets[0].coingecko_id) {
  //     return ChainFetch.fetch(
  //       "https://api.coingecko.com",
  //       `/api/v3/coins/${coin ||
  //         conf.assets[0]
  //           .coingecko_id}/market_chart?vs_currency=${currency}&days=${days}`
  //     );
  //   }
  //   return null;
  // }

  // async getMarketChart() {
  //   const currency = "krw";
  //   const coin = "reap";

  //   try {
  //     const { data } = await coinoneAxios.get(
  //       `/public/v2/chart/${currency}/${coin}?interval=1h`
  //     );
  //     if (data.result && data.result === "success") {
  //       const chartDataPrices = data.chart.map((chartData) => {
  //         return [Number(chartData.timestamp), Number(chartData.close)];
  //       });
  //       console.log("getMarketChart : ", chartDataPrices);
  //       return {
  //         prices: chartDataPrices,
  //       };
  //     }
  //     return null;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  async getMarketChartUSDT() {
    try {
      const { data } = await gateioAxios.get(
        `/api2/1/candlestick2/reap_usdt?group_sec=3600&range_hour=168`
      );
      if (
        data.result &&
        (data.result === "success" || data.result === "true")
      ) {
        const chartDataPrices = data.data.map((chartData) => {
          return [Number(chartData[0]), Number(chartData[2])];
        });
        return {
          prices: chartDataPrices,
        };
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMarketChartProxy() {
    try {
      const { data } = await chartProxy.get(`default/chart`);
      if (
        data.result &&
        (data.result === "success" || data.result === "true")
      ) {
        const chartDataPrices = data.data.map((chartData) => {
          return [Number(chartData[0]), Number(chartData[2])];
        });

        return {
          prices: chartDataPrices,
        };
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // CoinMarketCap
  static async fetchCoinMarketCap(url) {
    const host = "https://price.ping.pub";
    return fetch(host + url).then((response) => response.json());
  }

  static async fetchTokenQuote(symbol) {
    // return ChainFetch.fetchCoinMarketCap(`/quote/${symbol}`);
  }

  // Simulate Execution of tx
  async simulate(bodyBytes, config = null) {
    const txString = toBase64(TxRaw.encode(bodyBytes).finish());
    const txRaw = {
      tx_bytes: txString,
    };

    return this.post("/cosmos/tx/v1beta1/simulate", txRaw, config);
  }

  // Tx Submit
  async broadcastTx(bodyBytes, config = null) {
    const txString = toBase64(TxRaw.encode(bodyBytes).finish());
    const txRaw = {
      tx_bytes: txString,
      mode: "BROADCAST_MODE_SYNC", // BROADCAST_MODE_SYNC, BROADCAST_MODE_BLOCK, BROADCAST_MODE_ASYNC
    };
    return this.post("/cosmos/tx/v1beta1/txs", txRaw, config).then((res) => {
      if (res.code && res.code !== 0) {
        throw new Error(res.message);
      }
      if (res.tx_response && res.tx_response.code !== 0) {
        throw new Error(res.tx_response.raw_log);
      }
      return res;
    });
  }

  async post(url = "", data = {}, config = null) {
    if (!config) {
      this.getSelectedConfig();
    }
    const conf = config || this.config;
    const index = this.getApiIndex(config);
    // Default options are marked with *
    const response = await fetch(
      (Array.isArray(conf.api) ? conf.api[index] : conf.api) + url,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // credentials: 'same-origin', // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        headers: {
          "Content-Type": "text/plain",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      }
    );
    // const response = axios.post((config ? config.api : this.config.api) + url, data)
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async get(url, config = null) {
    if (!config) {
      this.getSelectedConfig();
    }
    const conf = config || this.config;
    const finalurl =
      (Array.isArray(conf.api)
        ? conf.api[this.getApiIndex(config)]
        : conf.api) + url;
    const ret = await fetch(finalurl).then((response) => response.json());
    return ret;
  }

  getApiIndex(config = null) {
    const conf = config || this.config;
    const index = Number(
      localStorage.getItem(`${conf.chain_name}-api-index`) || 0
    );
    return index < conf.api.length ? index : 0;
  }

  async getUrl(url) {
    this.getSelectedConfig();
    return fetch(url).then((res) => res.json());
  }

  static fetch(host, url) {
    const ret = fetch(
      (Array.isArray(host) ? host[0] : host) + url
    ).then((response) => response.json());
    return ret;
  }
}

// export default chainAPI
