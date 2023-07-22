<template>
  <div class="default-input">
    <span class="input__error" :key="index" v-for="(error, index) in errors"
      >* {{ error.$message }}</span
    >
    <a-input
      size="large"
      :value="modelValue"
      @change="emitChange"
      :placeholder="placeholder"
    />
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
}

withDefaults(defineProps<Props>(), {
  placeholder: "",
});

function emitChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
  emit("change", target.value);
}
</script>

<style scoped lang="scss">
@import "@/theme/variables.scss";

.default-input {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 2px;

  .input__error {
    font-size: 11px;
    font-style: italic;
    font-weight: 300;
    color: $placeholder-color;
  }
}
</style>
