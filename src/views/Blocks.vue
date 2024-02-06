<template>
  <div>
    <b-card no-body class="text-truncate">
      <b-card-header>
        <b-card-title>
          Latest Blocks
        </b-card-title>
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
        style="position: absolute; left: 50%; margin-left: -145px;"
        v-model="currentPage"
        :total-rows="lastBlockNum"
        :per-page="perPage"
        aria-controls="blocks-table"
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
  // created() {
  //   this.$http.getLatestBlock().then((res) => {
  //     this.blocks.push(res);
  //     const list = [];
  //     const { height } = res.block.header;
  //     for (let i = 1; i < 20; i += 1) {
  //       list.push(height - i);
  //     }

  //     if (!getCachedValidators()) {
  //       this.$http.getValidatorList();
  //     }

  //     let promise = Promise.resolve();
  //     list.forEach((item) => {
  //       promise = promise.then(
  //         () =>
  //           new Promise((resolve) => {
  //             this.$http.getBlockByHeight(item).then((b) => {
  //               resolve();
  //               this.blocks.push(b);
  //             });
  //           })
  //       );
  //     });
  //     this.timer = setInterval(this.fetch, 6000);
  //   });
  // },
  async created() {
    this.initBlocks();

    // this.applyPage(myPage, lastBlockNum);

    // this.$http.getLatestBlock().then(async (res) => {
    //   return;
    //   this.lastBlock = res;

    //   const pageNum = Number(page);
    //   if (pageNum && !isNaN(pageNum)) {
    //     this.lastBlockNum = Number(this.lastBlock.block.header.height);

    //     this.applyPage();
    //   } else {
    //     this.lastBlockNum = Number(this.lastBlock.block.header.height);
    //   }

    //   let tempBlockNum = this.lastBlockNum;
    //   let loopFlag = true;
    //   for (let i = 1; loopFlag; i++) {
    //     if (tempBlockNum <= this.perPage) {
    //       loopFlag = false;
    //     } else {
    //       tempBlockNum -= this.perPage;
    //     }
    //     this.blockCache[i] = [];
    //   }

    //   const _this = this;

    //   let height = _this.lastBlock.block.header.height;

    //   const dummyArr = new Array(this.perPage).fill("");
    //   const newBlocks = await Promise.all(
    //     dummyArr.map(async (value) => {
    //       const newBlock = _this.$http.getBlockByHeight(height);
    //       height -= 1;
    //       return Block.create(await newBlock);
    //     })
    //   );

    //   this.blockCache[1] = newBlocks.slice();
    //   this.blocks = newBlocks;

    //   // if (page) {
    //   //   this.currentPage = page;
    //   //   this.applyPage(page);
    //   //   return;
    //   // }

    //   // if (!getCachedValidators()) {
    //   //   this.$http.getValidatorList();
    //   // }
    // });
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
    // fetch() {
    //   this.$http.getLatestBlock().then((b) => {
    //     const has = this.blocks.findIndex(
    //       (x) => x.block.header.height === b.block.header.height
    //     );
    //     if (has < 0) this.blocks.unshift(b);
    //     if (this.blocks.length > 200) this.blocks.pop();
    //   });
    // },
    async initBlocks(targetPage) {
      // const { page } = this.$route.query;
      // const myPage = Number(page) || 1;
      const myPage = targetPage || 1;

      console.log("myPage : ", myPage);

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

      console.log("dummyBlocks : ", dummyBlocks);

      this.blocks = dummyBlocks;
      // this.blocks = [].concat(dummyBlocks);
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
      return zeroValueIdx === -1 ? newBlocks : newBlocks.slice(0, zeroValueIdx);
    },
    applyPage(newPage, lastBlockNum) {
      const subtractNum = (newPage - 1) * this.perPage;
      const dummyArr = new Array(subtractNum).fill("");

      this.createDummyBlocks(subtractNum, lastBlockNum).then((newBlocks) => {
        this.blockCache[newPage] = newBlocks;
        this.blocks = dummyArr.concat(newBlocks);
      });

      // this.blocks = dummyArr.concat(cacheData);
    },
  },
  watch: {
    currentPage(newCurrentPage) {
      this.initBlocks(newCurrentPage);

      this.$router
        .push({
          params: {
            page: newCurrentPage,
          },
        })
        .catch(() => {});
      // this.applyPage(newCurrentPage);
    },
  },
};
</script>
