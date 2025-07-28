<script lang="ts" setup>
import { defineProps } from 'vue';
import Num from './Num.vue';
const props = defineProps<{
  amount: number;
}>();
</script>

<template>
  <Num :amount="props.amount">
    <img src="/images/generated/sapling.webp" class="resource-icon" />
  </Num>
</template>
