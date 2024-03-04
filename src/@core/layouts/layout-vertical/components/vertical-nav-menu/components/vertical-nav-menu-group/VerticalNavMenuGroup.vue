<template>
  <li
    v-if="canViewVerticalNavMenuGroup(item)"
    class="nav-item has-sub"
    :class="{
      open: isOpen,
      disabled: item.disabled,
      'sidebar-group-active': isActive,
    }"
  >
    <b-dropdown
      :text="versionName"
      :variant="item.tagVariant || 'primary'"
      class="d-flex align-items-center custom-dropdown"
      right
    >
      <b-dropdown-item
        v-for="item in dropdownItems"
        :key="item.version"
        class="custom-dropdown-item"
        :href="item.link"
        target="_blank"
      >
        {{ item.name }}
      </b-dropdown-item>
    </b-dropdown>

    <b-collapse v-model="isOpen" class="menu-content" tag="ul">
      <component
        :is="resolveNavItemComponent(child)"
        v-for="child in item.children"
        :key="child.header || child.title"
        ref="groupChild"
        :item="child"
      />
    </b-collapse>
  </li>
</template>

<style scoped>
.custom-dropdown {
  background-color: linear-gradient(118deg, #00264c, rgba(0, 38, 76, 0.7));
  border: 1px solid #ccc;
  size: 25px;
  margin: 15px; /* Add your desired margin value */
  /* ... add more styles as needed */
  margin-bottom: 12px;
}

.dropdown-toggle {
  size: 55px;
}

.custom-dropdown-item {
  /* Your custom styles here */
  background-color: #f0f0f0;
  /* size: 100px; */
  margin: 10px; /* Add your desired margin value */
  /* ... add more styles as needed */

  a {
    width: 208px;
    text-align: center;
  }
}
</style>

<script>
import {
  BLink,
  BBadge,
  BCollapse,
  BAvatar,
  BDropdown,
  BDropdownItem,
} from "bootstrap-vue";
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@core/layouts/utils";
import { useUtils as useI18nUtils } from "@core/libs/i18n";
import { useUtils as useAclUtils } from "@core/libs/acl";
import VerticalNavMenuHeader from "../vertical-nav-menu-header";
import VerticalNavMenuLink from "../vertical-nav-menu-link/VerticalNavMenuLink.vue";

// Composition Function
import useVerticalNavMenuGroup from "./useVerticalNavMenuGroup";
import mixinVerticalNavMenuGroup from "./mixinVerticalNavMenuGroup";

import { chainInfo } from "/env/reapchain.config";

const reapchainVersion = {
  "v3.1": {
    version: "v3.1",
    name: "Reapchain-V3.1",
    link: "https://dashboard.reapchain.org",
  },
  "v3.0": {
    version: "v3.0",
    name: "Reapchain-V3.0",
    link: "https://v3.dashboard.reapchain.org",
  },
  "v2.0": {
    version: "v2.0",
    name: "Reapchain-V2.0",
    link: "https://v2.dashboard.reapchain.org",
  },
};

export default {
  name: "VerticalNavMenuGroup",
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    BAvatar,
    BLink,
    BBadge,
    BCollapse,
    BDropdown,
    BDropdownItem,
  },
  mixins: [mixinVerticalNavMenuGroup],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    let dropdownItems = [];
    let versionName = "";

    if (chainInfo.version === "v3.1" || !chainInfo.version) {
      dropdownItems = [reapchainVersion["v3.0"], reapchainVersion["v2.0"]];
      versionName = reapchainVersion["v3.1"].name;
    } else if (chainInfo.version === "v3.0") {
      dropdownItems = [reapchainVersion["v3.1"], reapchainVersion["v2.0"]];
      versionName = reapchainVersion["v3.0"].name;
    } else if (chainInfo.version === "v2.0") {
      dropdownItems = [reapchainVersion["v3.1"], reapchainVersion["v3.0"]];
      versionName = reapchainVersion["v2.0"].name;
    }

    return {
      dropdownItems,
      versionName,
    };
  },
  setup(props) {
    const {
      isOpen,
      isActive,
      updateGroupOpen,
      updateIsActive,
    } = useVerticalNavMenuGroup(props.item);

    const { t } = useI18nUtils();
    const { canViewVerticalNavMenuGroup } = useAclUtils();

    return {
      resolveNavItemComponent,
      isOpen: true,
      isActive,
      updateGroupOpen,
      updateIsActive,

      // ACL
      canViewVerticalNavMenuGroup,

      // i18n
      t,
    };
  },
  computed: {},
};
</script>
