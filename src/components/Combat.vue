<script setup lang="ts">
import { store } from '../store.ts'
import SlowButton from './SlowButton.vue';

type Attack = {
  duration: number;
  damage: number;
  description: string;
};

const attacks: Record<string, Attack> = {
  'Purple Spark': { duration: 20, damage: 5, description: 'A powerful spark that deals damage over time.' },
  'Acid Bolt': { duration: 5, damage: 10, description: 'A corrosive bolt that deals immediate damage.' },
  'Health Potion': { duration: 1, damage: 10, description: 'A potion that restores health over time.' },
  'Blessing of the Woods': { duration: 2, damage: 10, description: 'Calls the creatures of the forest to your aid.' },
  'Wooden Stick': { duration: 0.5, damage: 1, description: 'Whack it with a stick.' },
};

function executeAttack(attack: Attack) {
  store.damage += attack.damage;
}

</script>

<template>

  <div class="card">
    damage: {{ store.damage }}
  </div>
  <div class="card" v-for="(attack, name) in attacks" :key="name">
    <SlowButton :timer-key="`attack-${name}`" :title="name" :description="attack.description"
      :image="`/images/generated/${name}.png`"
      :duration="attack.duration * 1000" @done="executeAttack(attack)"/>
  </div>

</template>

<style scoped></style>
