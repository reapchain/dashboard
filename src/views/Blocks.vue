<template>
  <div>
    <b-card no-body class="text-truncate">
      <b-card-header>
        <b-card-title> Latest Blocks </b-card-title>
      </b-card-header>
      <b-table
        :items="blocks"
        :fields="list_fields"
        :sort-desc="true"
        sort-by="tokens"
        striped
        hover
        stacked="sm"
      >
        <!-- Column: Height -->
        <template #cell(height)="data">
          <router-link :to="`./blocks/${data.item.block.header.height}`">
            {{ data.item.block.header.height }}
          </router-link>
        </template>
        <template #cell(hash)="data">
          <small>{{ data.item.block_id.hash }}</small>
        </template>
        <template #cell(time)="data">
          {{ formatTime(data.item.block.header.time) }}
        </template>
        <template #cell(proposer)="data">
          {{ formatProposer(data.item.block.header.proposer_address) }}
        </template>
        <template #cell(txs)="data">
          {{ length(data.item.block.data.txs) }}
        </template>
      </b-table>
    </b-card>

    <div class="mt-3" style="padding-bottom: 36px;">
      <b-pagination
        v-if="!isFirst"
        style="position: absolute; left: 50%; margin-left: -145px;"
        v-model="currentPage"
        :total-rows="lastBlockNum"
        :per-page="perPage"
        aria-controls="blocks-table"
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
import {
  Block,
  getCachedValidators,
  getStakingValidatorByHex,
  toDay,
} from "@/libs/utils";
// import fetch from 'node-fetch'

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
      islive: true,
      blocks: [],

      // pagenation
      isFirst: true,
      lastBlockHeight: 1912809,
      lastBlockNum: 0,
      perPage: 20,
      currentPage: 1,
      total: 0,
      lastBlock: {},
      blockCache: [],

      list_fields: [
        {
          key: "height",
          sortable: true,
        },
        {
          key: "hash",
          thClass: "d-none d-lg-block",
          tdClass: "d-none d-lg-block text-truncate",
        },
        {
          key: "proposer",
          tdClass: "text-truncate",
        },
        {
          key: "txs",
        },
        {
          key: "time",
          thClass: "d-none d-md-block",
          tdClass: "d-none d-md-block",
        },
      ],
    };
  },
  async created() {
    await this.initBlocks();
    this.isFirst = false;
  },
  mounted() {
    const { page } = this.$route.query;
    const myPage = page ? Number(page) : 1;
    this.currentPage = myPage;
  },
  beforeDestroy() {
    this.islive = false;
    clearInterval(this.timer);
  },
  methods: {
    length: (v) => (Array.isArray(v) ? v.length : 0),
    formatTime: (v) => toDay(v, "time"),
    formatProposer(v) {
      return getStakingValidatorByHex(this.$http.config.chain_name, v);
    },
    async initBlocks() {
      const { page } = this.$route.query;
      const myPage = page ? Number(page) : 1;

      this.currentPage = myPage;

      const lastBlockNum = await this.getLatestBlock();
      this.lastBlockNum = lastBlockNum;

      this.blocks = [];

      const subtractNum = (myPage - 1) * this.perPage;
      const dummyArr = new Array(this.perPage).fill("");
      let height = lastBlockNum - subtractNum;

      const _this = this;
      const newBlocks = await Promise.all(
        dummyArr.map(async (value) => {
          if (height !== 0) {
            const newBlock = _this.$http.getBlockByHeight2(height);
            height -= 1;
            return Block.create(await newBlock);
          }

          return "";
        })
      );

      const zeroValueIdx = newBlocks.indexOf("");
      const dummyBlocks =
        zeroValueIdx === -1 ? newBlocks : newBlocks.slice(0, zeroValueIdx);

      this.blocks = dummyBlocks;
    },
    async getLatestBlock() {
      const latestBlock = await this.$http.getLatestBlockData();
      const height = Number(latestBlock.block.header.height);
      return height;
    },
    async createDummyBlocks(subtractNum, lastBlockNum) {
      let height = lastBlockNum - subtractNum;

      const _this = this;
      const dummyArr = new Array(this.perPage).fill("");
      const newBlocks = await Promise.all(
        dummyArr.map(async (value) => {
          if (height !== 0) {
            const newBlock = _this.$http.getBlockByHeight2(height);
            height -= 1;
            return Block.create(await newBlock);
          }

          return "";
        })
      );

      const zeroValueIdx = newBlocks.indexOf("");
      const resultBlocks =
        zeroValueIdx === -1 ? newBlocks : newBlocks.slice(0, zeroValueIdx);

      return resultBlocks;
    },
    pageClick(button, page) {
      this.$router
        .push({
          query: {
            page,
          },
        })
        .catch(() => {});
    },
  },
  watch: {
    $route() {
      if (!this.isFirst) {
        this.initBlocks();
      }
    },
  },
};
</script>
