<script lang="ts" setup>
import { defineProps } from 'vue';
import { numberFormat } from '../store.ts';
const props = defineProps<{
  amount: number;
}>();
</script>

<template>
  <span class="numbers">{{ numberFormat.format(props.amount) }}
    <img src="/images/generated/fruit.webp" class="resource-icon" /></span>
</template>
