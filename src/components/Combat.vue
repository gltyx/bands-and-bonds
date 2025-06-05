<script setup lang="ts">
import { store, attacks } from '../store.ts'
import Progress from './Progress.vue'

function startAttack(name: string) {
  store.attackTimers[name] = 0;
}

</script>

<template>

  <div class="card">
    damage: {{ store.damage }}
  </div>
  <div class="card" v-for="(attack, name) in attacks" :key="name">
    <Progress v-if="store.attackTimers[name] !== undefined" :value="store.attackTimers[name]"
      :max="attack.duration * 1000">
      {{ store.attackTimers[name] }} / {{ attack.duration * 1000 }}
    </Progress>
    <button v-if="store.attackTimers[name] === undefined" @click="startAttack(name)">{{ name }}</button>
  </div>

</template>

<style scoped></style>
