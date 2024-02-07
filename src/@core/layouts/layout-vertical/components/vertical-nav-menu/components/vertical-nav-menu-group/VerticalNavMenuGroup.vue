Dropdown Rough






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
      :text="'MAINNET'"
      :variant="item.tagVariant || 'primary'"
      class="d-flex align-items-center custom-dropdown   "
      right
    >
      <b-dropdown-item class="custom-dropdown-item" href="https://v2.dashboard.reapchain.org/dashboard" target="_blank">
        V2
      </b-dropdown-item>
      <b-dropdown-item class="custom-dropdown-item" href="https://v3.dashboard.reapchain.org/dashboard" target="_blank">
        V3
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
  margin: 10px; /* Add your desired margin value */
  /* ... add more styles as needed */
  margin-bottom: 25px;
}

.dropdown-toggle{
  size: 55px;
}

.custom-dropdown-item {
  /* Your custom styles here */
  background-color: #f0f0f0;
  size: 25px;
  margin: 10px; /* Add your desired margin value */
  /* ... add more styles as needed */
}
</style>

<script>
import { BLink, BBadge, BCollapse, BAvatar, BDropdown, BDropdownItem } from "bootstrap-vue";
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@core/layouts/utils";
import { useUtils as useI18nUtils } from "@core/libs/i18n";
import { useUtils as useAclUtils } from "@core/libs/acl";
import VerticalNavMenuHeader from "../vertical-nav-menu-header";
import VerticalNavMenuLink from "../vertical-nav-menu-link/VerticalNavMenuLink.vue";

// Composition Function
import useVerticalNavMenuGroup from "./useVerticalNavMenuGroup";
import mixinVerticalNavMenuGroup from "./mixinVerticalNavMenuGroup";

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
    BDropdownItem
  },
  mixins: [mixinVerticalNavMenuGroup],
  props: {
    item: {
      type: Object,
      required: true,
    },
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
};
</script>

