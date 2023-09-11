import store from "@/store";
import { chainInfo } from "@/chains/config/reapchain.config";

const modules = [
  // {
  //   scope: "normal",
  //   title: "summary",
  //   route: "info",
  // },
  {
    scope: "normal",
    title: "Dashboard",
    route: "dashboard",
  },
  {
    scope: "normal",
    title: "blocks",
    route: "blocks",
  },
  {
    scope: "normal",
    title: "staking",
    route: "staking",
  },
  {
    scope: "normal",
    title: "Parameters",
    route: "parameters",
  },
  {
    scope: "normal",
    title: "governance",
    route: "governance",
  },
  {
    scope: "normal",
    title: "uptime",
    route: "uptime",
  },
  {
    scope: "normal",
    title: "statesync",
    route: "statesync",
  },
  // {
  //   scope: "cos-mos",
  //   title: "gravity",
  //   route: "gravity",
  // },
  // {
  //   scope: "osmosis",
  //   title: "trade",
  //   route: "osmosis-trade",
  // },
];

const modules_main = [
  {
    scope: "normal",
    title: "Dashboard",
    route: "dashboard",
  },
  {
    scope: "normal",
    title: "blocks",
    route: "blocks",
  },
  {
    scope: "normal",
    title: "validators",
    route: "validators",
  },
  {
    scope: "normal",
    title: "uptime",
    route: "uptime",
  },
  {
    scope: "normal",
    title: "statesync",
    route: "statesync",
  },
];

function processMenu() {
  const chainMenus = [];
  Object.keys(store.state.chains.config).forEach((chain) => {
    const menu = {
      title: chain,
      icon: store.state.chains.config[chain].logo,
    };
    const { excludes } = store.state.chains.config[chain];
    const children = [];

    const tempModules = modules;
    tempModules.forEach((m) => {
      if (excludes === undefined || excludes.indexOf(m.route) === -1) {
        if (m.scope.match("normal") || m.scope.match(chain)) {
          children.push({
            // header: `item-${chain}-${m.route}`,
            title: m.title,
            route: { name: m.route, params: { chain } },
          });
        }
      }
    });
    menu.children = children;
    chainMenus.push(menu);
  });
  // chainMenus.push({ header: "header" });
  // chainMenus.push({
  //   title: 'Github',
  //   href: '',
  //   icon: 'GithubIcon',
  // })
  return chainMenus;
}

export default processMenu();
