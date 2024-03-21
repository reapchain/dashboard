<template>
  <b-card class="text-center" @click="handleClickLink()">
    <div class="link-area">
      <div>
        <img src="/bridge_logo.png" width="120" alt="BridgeLogo" />
      </div>
      <div style="margin-top: 12px;">
        <h4 class="font-weight-bolder">Reapchain<br />Bridge</h4>
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
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "primary",
    },
  },
  methods: {
    handleClickLink() {
      window.open("https://bridge.reapchain.org", "_blank");
    },
  },
};
</script>

<style>
.link-area {
  padding: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
