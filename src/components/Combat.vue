<script setup lang="ts">
import { store } from '../store.ts'
import SlowButton from './SlowButton.vue';

type Attack = {
  duration: number;
  damage: number;
  image: string;
  description: string;
};

const attacks: Record<string, Attack> = {
  'Purple spark': { duration: 20, damage: 5, image: 'purple-spark', description: 'A powerful spark that deals damage over time.' },
  'Acid bolt': { duration: 5, damage: 10, image: 'acid-bolt', description: 'A corrosive bolt that deals immediate damage.' },
  'Health potion': { duration: 5, damage: 10, image: 'flask-green', description: 'A potion that restores health over time.' },
  'Blessing of the Woods': { duration: 5, damage: 10, image: 'deer-skull', description: 'A blessing that enhances your abilities.' },
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
      :image="`/images/${attack.image}.png`"
      :duration="attack.duration * 1000" @done="executeAttack(attack)"/>
  </div>

</template>

<style scoped></style>
