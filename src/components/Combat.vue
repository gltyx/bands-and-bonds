<script setup lang="ts">
import { store } from '../store.ts'
import SlowButton from './SlowButton.vue';

type Attack = {
  duration: number;
  damage: number;
  image: string;
};

const attacks: Record<string, Attack> = {
  'purple spark': { duration: 20, damage: 5, image: 'purple-spark' },
  'acid bolt': { duration: 5, damage: 10, image: 'acid-bolt' },
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
    <SlowButton :timer-key="`attack-${name}`" :title="name" :image="`/images/${attack.image}.png`"
      :duration="attack.duration * 1000" @done="executeAttack(attack)"/>
  </div>

</template>

<style scoped></style>
