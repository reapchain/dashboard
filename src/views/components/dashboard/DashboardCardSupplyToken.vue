<template>
  <b-card class="">
    <h4 class="title">
      Supply(ERC-20)
    </h4>
    <div class="container">
      <div class="left">
        - Total Supply <br />
        - Circulating Supply <br />
        - Max Supply <br />
      </div>
      <div class="right">
        1,395,000,000 REAP <br />
        2,200,000,000 REAP <br />
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
  props: {},
  computed: {},
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
  font-family: "Montserrat", Helvetica, Arial, serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.45;
  color: #6e6b7b;
}
.right {
  flex: 1;
  font-weight: 700;
}
</style>
