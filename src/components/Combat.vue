<script setup lang="ts">
import { store } from "../store.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";

type Attack = {
  duration: number;
  damage: number;
  description: string;
};

const attacks: Record<string, Attack> = {
  "Purple Spark": {
    duration: 20,
    damage: 5,
    description: "A powerful spark that deals damage over time.",
  },
  "Acid Bolt": {
    duration: 5,
    damage: 10,
    description: "A corrosive bolt that deals immediate damage.",
  },
  "Health Potion": {
    duration: 1,
    damage: 10,
    description: "A potion that restores health over time.",
  },
  "Blessing of the Woods": {
    duration: 2,
    damage: 10,
    description: "Calls the creatures of the forest to your aid.",
  },
  "Wooden Stick": {
    duration: 0.5,
    damage: 1,
    description: "Whack it with a stick.",
  },
  "Lunar Portal": {
    duration: 0.5,
    damage: 1,
    description: "Open a portal to the moon.",
  },
  Enscribe: {
    duration: 0.5,
    damage: 1,
    description:
      "Write down the name of the monster. Deals 3d6 points of damage.",
  },
};

const enemy = store.enemy;

function executeAttack(attack: Attack) {
  store.damage += attack.damage;
}
</script>

<template>

  <div class="card enemy">
    <div class="description">Currently fighting:</div>
    <h1>{{ enemy.name }}</h1>
    <img :src="`/images/generated/${enemy.name}.png`" :alt="enemy.name" />
    <Progress :value="enemy.health - store.damage" :max="enemy.health" color="#c00">
      {{ enemy.health - store.damage }} / {{ enemy.health }} HP
    </Progress>
  </div>
  <div class="card" v-for="(attack, name) in attacks" :key="name">
    <SlowButton :timer-key="`attack-${name}`" :title="name" :description="attack.description"
      :image="`/images/generated/${name}.png`" :duration="attack.duration * 1000" @done="executeAttack(attack)" />
  </div>

</template>

<style scoped>
.enemy {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: -5px;
    margin-bottom: 10px;
    font-weight: 600;
    font-family: "Grenze Gotisch", serif;
    font-size: 30px;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 40%;
    border: 2px outset #edb;
    box-shadow: 0 0 10px #000;
  }
}
</style>
