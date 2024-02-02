import store from "@/store";
import { chainInfo } from "/env/reapchain.config";

let modules = [
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
  {
    scope: "normal",
    title: "bridge",
    route: "bridge",
  },
];

if (chainInfo.version) {
  if (chainInfo.version === "v3.1") {
    modules = modules.concat([
      {
        scope: "normal",
        title: "reapchain-v3.0",
        route: "reapchain-v3.0",
      },
      {
        scope: "normal",
        title: "reapchain-v2.0",
        route: "reapchain-v2.0",
      },
    ]);
  } else if (chainInfo.version === "v3.0") {
    modules = modules.concat([
      {
        scope: "normal",
        title: "reapchain-v3.1",
        route: "reapchain-v3.1",
      },
      {
        scope: "normal",
        title: "reapchain-v2.0",
        route: "reapchain-v2.0",
      },
    ]);
  } else if (chainInfo.version === "v2.0") {
    modules = modules.concat([
      {
        scope: "normal",
        title: "reapchain-v3.1",
        route: "reapchain-v3.1",
      },
      {
        scope: "normal",
        title: "reapchain-v3.0",
        route: "reapchain-v3.0",
      },
    ]);
  }
}

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

    // let tempModules = chainInfo.env === "main" ? modules_main : modules;
    let tempModules = modules;

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
