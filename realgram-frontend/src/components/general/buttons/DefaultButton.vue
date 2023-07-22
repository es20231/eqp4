<template>
  <a-button
    :type="type == 'tertiary' ? 'text' : 'primary'"
    :class="[
      `--${fontSize}`,
      'default-btn',
      `--${type}`,
      `--${variant}`,
      `--${size}`,
      { '--block': block },
      { '--circle': circle },
      { '--square': square },
      { '--no-padding': noPadding },
    ]"
    :style="{
      'font-weight': fontWeight,
    }"
  >
    <loading-outlined v-if="loading"></loading-outlined>
    <Icon v-if="icon && !loading" :name="icon" />

    <slot></slot>
  </a-button>
</template>

<script setup lang="ts">
import { LoadingOutlined } from "@ant-design/icons-vue";
import Icon from "@/components/shared/icons/index.vue";

import { defineProps } from "vue";

interface Props {
  block?: boolean;
  circle?: boolean;
  square?: boolean;
  loading?: boolean;
  noPadding?: boolean;
  type?: "primary" | "secondary" | "tertiary";
  variant?: "success" | "warning" | "danger" | "info" | "grey";
  size?: "small" | "medium" | "large" | "giant";
  fontWeight?: string;
  icon?: string;
  fontSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  block: false,
  circle: false,
  square: false,
  loading: false,
  noPadding: false,
  type: "primary",
  size: "medium",
  fontWeight: "500",
  icon: "",
  fontSize: "font-default",
});

// defineProps({
//   block: {
//     type: Boolean,
//     default: false,
//   },
//   circle: {
//     type: Boolean,
//     default: false,
//   },
//   square: {
//     type: Boolean,
//     default: false,
//   },
//   loading: {
//     type: Boolean,
//     default: false,
//   },
//   type: {
//     type: String,
//     default: "primary",
//   },
//   variant: {
//     type: String,
//     default: "default",
//   },
//   size: {
//     type: String,
//     default: "medium",
//   },
//   icon: {
//     type: String,
//     required: false,
//   },
//   fontSize: {
//     type: String,
//     default: "font-default",
//   }
// });
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.default-btn {
  width: max-content !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 4px !important;
  gap: 0.5rem;

  // Width
  &.--block {
    width: 100% !important;
  }

  // Padding
  &.--no-padding {
    padding: 0px !important;
  }

  // Geometry
  &.--circle {
    border-radius: 50% !important;
    padding: 10px 10px !important;
  }

  &.--square {
    font-size: 14px !important;
    height: 32px !important;
    padding: 10px 10px !important;
  }

  // SIZES
  &.--small {
    font-size: 12px !important;
    height: 30px;
    padding: 7px 16px;
  }

  &.--medium {
    font-size: 14px !important;
    height: 32px;
    padding: 8px 16px;
  }

  &.--large {
    font-size: 16px !important;
    height: 38px;
    padding: 9px 16px;
  }

  &.--giant {
    font-size: 18px !important;
    height: 54px;
    padding: 14px 16px;
  }

  //text font-size
  &.--font-small {
    font-size: 10px !important;
  }

  &.--font-default {
    font-size: 12px !important;
  }
}
</style>
