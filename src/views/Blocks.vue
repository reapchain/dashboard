<template>
  <div>
    <b-card no-body class="text-truncate">
      <b-card-header v-show="false">
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
        v-if="!isFirst && totalRows > 0"
        style="position: absolute; left: 50%; margin-left: -145px;"
        v-model="currentPage"
        :total-rows="totalRows"
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
import { chainInfo } from "/env/reapchain.config";

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
    let minBlockNum = 1;

    if (chainInfo.version === "v3.1") {
      minBlockNum = 1912809;
    } else if (chainInfo.version === "v3.0") {
      minBlockNum = 1491802;
    }

    return {
      islive: true,
      blocks: [],

      // pagenation
      isFirst: true,
      lastBlockNum: 0,
      minBlockNum,
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
  computed: {
    totalRows() {
      if (!this.lastBlockNum) {
        return 0;
      }

      return this.lastBlockNum - this.minBlockNum;
    },
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
          if (height < 1 || height < this.minBlockNum) {
            return "";
          }

          const newBlock = _this.$http.getBlockByHeight2(height);
          height -= 1;
          return Block.create(await newBlock);
        })
      );

      const zeroValueIdx = newBlocks.indexOf("");
      const dummyBlocks =
        zeroValueIdx === -1 ? newBlocks : newBlocks.slice(0, zeroValueIdx);

      this.blocks = dummyBlocks;

      this.executeFetchByPage(myPage);
    },
    async getLatestBlock() {
      const latestBlock = await this.$http.getLatestBlockData();
      const height = Number(latestBlock.block.header.height);
      return height;
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
    async fetch() {
      const latestBlock = await this.$http.getLatestBlockData();

      const has = this.blocks.findIndex(
        (x) => x.block.header.height === latestBlock.block.header.height
      );
      if (has < 0) this.blocks.unshift(latestBlock);
      if (this.blocks.length > 200) this.blocks.pop();
    },
    executeFetchByPage(page) {
      if (page === 1) {
        this.timer = setInterval(this.fetch, 4000);
      } else {
        clearInterval(this.timer);
      }
    },
  },
  watch: {
    $route() {
      if (!this.isFirst) {
        this.initBlocks();
      }
    },
    currentPage(to) {
      this.executeFetchByPage(to);
    },
  },
};
</script>
