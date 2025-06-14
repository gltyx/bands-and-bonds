<script setup lang="ts">
import { store, friends, damage, runData, takeTurn, type Ability } from "../store.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed } from "vue";

const enemy = computed(() => store.run.enemy);
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
  if (ab.onCompleted) {
    return ab.onCompleted();
  }
  if (ab.damage) {
    damage(ab.damage * store.run.weaponLevel);
  }
}
const fighting = computed(() => {
  return enemy.value && store.run.damage < enemy.value.health;
});

function retreat() {
  if (window.confirm("Are you sure you want to retreat?")) {
    store.run = runData();
  }
}

function describe(ab: Ability): string {
  let d = ab.description;
  if (typeof d === "function") {
    d = d();
  }
  if (ab.damage) {
    d += `\n\n${ab.damage * store.run.weaponLevel} damage`;
  }
  return d;
}
const possibleTurns = computed(() => {
  if (fighting.value) {
    return [];
  }
  const room = store.run.room;
  if (room.next) {
    return Object.entries(room.next).map(([title, { description }]) => ({ title, description }));
  }
  return [{ title: 'Keep going', description: 'Continue exploring the dungeon.' }];
});
</script>

<template>

  <div class="enemy" v-if="enemy">
    <div class="description" v-if="enemy.health > store.run.damage">Currently fighting:</div>
    <div class="description" v-else>Defeated!</div>
    <h1>{{ enemy.name }}</h1>
    <img :src="`/images/generated/${enemy.name}.webp`" :alt="enemy.name"
      :style="enemy.health <= store.run.damage && { filter: 'saturate(0.3) contrast(1.5)' }" />
    <Progress :value="enemy.health - store.run.damage" :max="enemy.health" color="#c00" label="HP" />
    <Progress v-if="enemy.armor" :value="enemy.armor - store.run.armorDamage" :max="enemy.armor" color="#666"
      label="Armor" />
  </div>
  <div class="actions">
    <template v-if="fighting" v-for="ab in abilities" :key="ab.name">
      <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describe(ab)"
        :image="`/images/generated/${ab.name}.webp`" :duration="ab.duration * 1000" @done="executeAbility(ab)" />
    </template>
    <button v-for="turn in possibleTurns" :key="turn.title" @click="takeTurn(turn.title)">
      <img :src="`/images/generated/${turn.title}.webp`" />
      <div class="text">
        <div class="title">{{ turn.title }}</div>
        <div class="description">{{ turn.description }}</div>
      </div>
    </button>
    <button @click="retreat()" v-if="store.run.steps > 0">
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

.actions {
  margin: 20px 0;
  columns: 310px auto;
  width: 80vw;
}

.actions>* {
  display: flex;
  margin: 10px auto;
}
</style>
