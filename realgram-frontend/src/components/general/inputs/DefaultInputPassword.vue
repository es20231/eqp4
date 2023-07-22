<template>
  <div class="default-input">
    <span class="input__error" :key="index" v-for="(error, index) in errors">{{
      error
    }}</span>
    <a-input-password
      size="large"
      :value="modelValue"
      @change="emitChange"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "change"]);

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  errors: {
    type: Array,
  },
  placeholder: {
    type: String,
    default: "",
  },
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
    font-size: 10px;
    font-style: italic;
    font-weight: 300;
    color: $placeholder-color;
  }
}
</style>
