<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{
  amount: number;
}>();
</script>

<template>
  <span class="numbers">{{ props.amount }}
    <img src="/images/generated/gold.webp" class="resource-icon" /></span>
</template>
