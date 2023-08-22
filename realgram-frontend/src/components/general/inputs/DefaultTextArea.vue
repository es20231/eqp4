<template>
  <div class="default-textarea">
    <span class="textarea__error" :key="index" v-for="(error, index) in errors"
      >* {{ error.$message }}</span
    >
    <a-textarea
      size="large"
      :value="modelValue"
      @change="emitChange"
      :bordered="!bordeless"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :autoSize="{ minRows, maxRows }"
    />
    <span class="textarea__limit">{{
      `${modelValue?.length}/${maxLength}`
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";

const emit = defineEmits(["update:modelValue", "change"]);

export interface IErrorObject {
  $propertyPath: string;
  $property: string;
  $validator: string;
  $message: string | Ref<string>;
  $params: object;
  $pending: boolean;
  $response: any;
  $uid: string;
}

interface Props {
  modelValue: string;
  errors?: IErrorObject[];
  placeholder?: string;
  maxLength?: number;
  height?: number;
  bordeless?: boolean;
  minRows?: number;
  maxRows?: number;
}

withDefaults(defineProps<Props>(), {
  placeholder: "",
  maxLength: 300,
  height: 150,
  bordeless: false,
  minRows: 2,
  maxRows: 5,
});

function emitChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
  emit("change", target.value);
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.default-textarea {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 2px;

  .textarea__error {
    font-size: 11px;
    font-style: italic;
    font-weight: 300;
    color: $placeholder-color;
  }

  .textarea__limit {
    width: 100%;
    text-align: right;
    font-size: 14px;
    color: #888;
  }
}
</style>

<style lang="scss">
.default-textarea {
  textarea {
    height: 130px;
    resize: none !important;
    scrollbar-width: thin;
    scrollbar-color: #888 #f0f0f0;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f0f0f0;
    }
  }
}
</style>
