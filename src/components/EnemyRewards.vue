<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { Enemy } from '../base.ts';
import Gold from './Gold.vue';
import Fruit from './Fruit.vue';
const props = defineProps<{
  enemy: Enemy;
}>();
import { store } from '../store.ts';
const fruit = computed(() => {
  let fruit = props.enemy.rewards?.fruit ?? 0;
  const bandSize = Object.keys(store.bandByName()).length;
  if (store.onboard('Royal Fruitbearer')) {
    fruit *= bandSize;
  }
  if (store.onboard('Royal Fruitwearer')) {
    fruit *= bandSize - 1;
  }
  return fruit;
});
</script>

<template>
  <Gold v-if="props.enemy.rewards?.gold" :amount="props.enemy.rewards?.gold" />
  <Fruit v-if="props.enemy.rewards?.fruit" :amount="fruit" />
  <span v-if="!props.enemy.rewards?.fruit && !props.enemy.rewards?.gold">nothing</span>
</template>
