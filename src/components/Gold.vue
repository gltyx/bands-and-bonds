<script lang="ts" setup>
import { defineProps } from 'vue';
import { numberFormat } from '../base.ts';
const props = defineProps<{
  amount: number;
}>();
</script>

<template>
  <span class="numbers">{{ numberFormat(props.amount) }}
    <img src="/images/generated/gold.webp" class="resource-icon" /></span>
</template>
