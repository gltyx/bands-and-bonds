<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { Enemy } from '../base.ts';
import Gold from './Gold.vue';
import Fruit from './Fruit.vue';
const props = defineProps<{
  enemy: Enemy;
}>();
import { bandByName, onboard } from '../store.ts';
const fruit = computed(() => {
  let fruit = props.enemy.rewards?.fruit ?? 0;
  if (onboard('Royal Fruitbearer')) {
    fruit *= Object.keys(bandByName.value).length;
  }
  if (onboard('Royal Fruitwearer')) {
    fruit *= Object.keys(bandByName.value).length - 1;
  }
  return fruit;
});
</script>

<template>
  <Gold v-if="props.enemy.rewards?.gold" :amount="props.enemy.rewards?.gold" />
  <Fruit v-if="props.enemy.rewards?.fruit" :amount="fruit" />
  <span v-if="!props.enemy.rewards?.fruit && !props.enemy.rewards?.gold">nothing</span>
</template>
