<script setup lang="ts">
import { store, friends, enemies, type Ability } from "../store.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed } from "vue";


const attacks: Record<string, Ability> = {
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

const enemy = computed(() => enemies[store.enemy]);
const abilities = computed(() => {
  const abilities = [] as Ability[];
  for (let row = 0; row < store.band.height; row++) {
    for (let col = 0; col < store.band.width; col++) {
      const place = col + row * store.band.width;
      const friend = friends[store.band[place]];
      for (const ab of friend?.abilities ?? []) {
        abilities.push(ab);
      }
    }
  }
  return abilities;
});

function executeAbility(ab: Ability) {
  store.damage += ab.damage;
  if (store.damage >= enemy.value.health) {
    store.damage = 0;
    store.enemy += 1;
  }
}

function retreat() {
  if (window.confirm("Are you sure you want to retreat?")) {
    store.damage = 0;
    store.enemy = 0;
    store.timers = {};
  }
}
</script>

<template>

  <div class="card enemy">
    <div class="description">Currently fighting:</div>
    <h1>{{ enemy.name }}</h1>
    <img :src="`/images/generated/${enemy.name}.webp`" :alt="enemy.name" />
    <Progress :value="enemy.health - store.damage" :max="enemy.health" color="#c00">
      {{ enemy.health - store.damage }} / {{ enemy.health }} HP
    </Progress>
  </div>
  <div class="card" v-for="ab in abilities" :key="ab.name">
    <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="ab.description"
      :image="`/images/generated/${ab.name}.webp`" :duration="ab.duration * 1000" @done="executeAbility(ab)" />
  </div>
  <div class="card">
    <button @click="retreat()">
      <img src="/images/generated/Retreat.webp" />
      <div class="text">
        <div class="title">Retreat</div>
        <div class="description">
          Leave the dungeon and return to safety. Live to fight another day.
        </div>
      </div>
    </button>
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
