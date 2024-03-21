<template>
  <b-card class="">
    <h4 class="title">
      Bridge Info
    </h4>
    <div class="container">
      <div class="left">
        - Locked Amount <br />
        <!-- - Token Contract <br /> -->
        - Bridge Contract <br />
      </div>
      <div class="right">
        {{ `53,400,847 REAP` || "-" }} <br />
        <div
          v-if="false"
          class="href-address"
          @click="handleClickLink(tokenContract)"
        >
          {{ abbrAddress(tokenContract) || "-" }}
        </div>
        <div class="href-address" @click="handleClickLink(bridgeContract)">
          {{ abbrAddress(bridgeContract) || "-" }}
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import { BCard } from "bootstrap-vue";
import { abbrAddress } from "@/libs/utils";

export default {
  components: {
    BCard,
  },
  props: {},
  computed: {},
  data() {
    return {
      tokenContract: "0x1fc5ef0337aea85c5f9198853a6e3a579a7a6987",
      bridgeContract: "0xd17518e7df4327480c2c1fdea343575428f62ffe",
    };
  },
  methods: {
    abbrAddress,
    handleClickLink(link) {
      window.open(`https://etherscan.io/address/${link}`, "_blank");
    },
  },
};
</script>

<style scoped>
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
.href-address {
  cursor: pointer;
  text-decoration: underline;
}
.left {
  flex: 1;
  font-family: "Montserrat", Helvetica, Arial, serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.45;
  color: #6e6b7b;
}
.right {
  flex: 1;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
}
</style>
