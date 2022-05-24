<template>
  <p class="clearfix mb-0"></p>
</template>

<script>
import { BLink, VBPopover } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  name: "AppFooter",
  components: {
    BLink,
  },
  directives: {
    "b-popover": VBPopover,
    Ripple,
  },
};
</script>
