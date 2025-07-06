<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { Enemy } from '../base.ts';
import Gold from './Gold.vue';
import Fruit from './Fruit.vue';
const props = defineProps<{
  enemy: Enemy;
}>();
import { store } from '../store.ts';
const rewards = computed(() => store.getRewards(props.enemy));
</script>

<template>
  <Gold v-if="rewards.gold" :amount="rewards.gold" />
  <Fruit v-if="rewards.fruit" :amount="rewards.fruit" />
  <span v-if="!rewards.fruit && !rewards.gold">nothing</span>
</template>
