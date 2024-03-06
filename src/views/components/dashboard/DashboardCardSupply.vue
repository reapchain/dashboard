<template>
  <b-card class="">
    <h4 class="title">
      Supply
    </h4>
    <div class="container">
      <div class="left">
        - Total Supply <br />
        - Circulating Supply <br />
        - Max Supply <br />
      </div>
      <div class="right" v-if="data.totalSupply">
        {{ data.totalSupply }} <br />
        {{ data.circulatingSupply }} <br />
        4,900,000,000 REAP <br />
      </div>
      <div class="right" v-else>
        - <br />
        - <br />
        4,900,000,000 REAP <br />
      </div>
    </div>
  </b-card>
</template>

<script>
import { BCard } from "bootstrap-vue";

export default {
  components: {
    BCard,
  },
  props: {
    data: {
      type: [Object],
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.title {
  text-align: left;
  font-weight: 600;
}
.container {
  display: flex;
  margin-top: 12px;
  padding: 0px;
  /* height: 300px; */
}
.left {
  flex: 1;
}
.right {
  flex: 1;
  font-weight: 700;
}
</style>
