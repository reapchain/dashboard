<template>
  <b-card class="align-self-stretch">
    <h4 class="title">
      Supply
    </h4>
    <div class="container">
      <div class="left">
        - Current Total <br />
        - Max <br />
      </div>
      <div class="right">
        {{ data.totalSupply || "-" }} <br />
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
  computed: {},
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
}
.left {
  flex: 2;
  font-family: "Montserrat", Helvetica, Arial, serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.45;
  color: #6e6b7b;
}
.right {
  flex: 3;
  text-align: right;
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
