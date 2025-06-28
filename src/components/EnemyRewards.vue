<script lang="ts" setup>
import { defineProps } from 'vue';
import type { Enemy } from '../base.ts';
import Gold from './Gold.vue';
import Fruit from './Fruit.vue';
const props = defineProps<{
  enemy: Enemy;
}>();
</script>

<template>
  <Gold v-if="props.enemy.rewards?.gold" :amount="props.enemy.rewards?.gold" />
  <Fruit v-if="props.enemy.rewards?.fruit" :amount="props.enemy.rewards?.fruit" />
</template>
