import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import { chainInfo } from "@/chains/config/reapchain.config";
import routerDev from "./router.dev";
import routerMain from "./router.main";

Vue.use(VueRouter);

const router = routerDev;

router.beforeEach((to, from, next) => {
  const c = to.params.chain;
  if (c) {
    store.commit("select", { chain_name: c });
    store.dispatch("chains/getAllIBCDenoms", Vue.prototype);
  }

  const config = JSON.parse(localStorage.getItem("chains"));
  // const has = Object.keys(config).findIndex(i => i === c)
  if (!config || Object.keys(config).findIndex((i) => i === c) > -1) {
    next();
  } else if (c) {
    if (c === "index.php") {
      next({ name: "/" });
    } else {
      next({ name: "chain-404" });
    }
  } else {
    next();
  }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
