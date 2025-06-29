<script setup lang="ts">
import { decoratedStore as store, damage, runData, takeTurn, describeAbility, nextTo, onboard, bandByName } from "../store.ts";
import { friendsByName } from "../friends.ts";
import type { Ability, Turn } from "../base.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed } from "vue";
import { destinationToPath, roomKey } from "../rooms.ts";
import EnemyRewards from "./EnemyRewards.vue";
import Gold from "./Gold.vue";
import Fruit from "./Fruit.vue";
import { enemiesByName } from "../enemies.ts";

const enemy = computed(() => store.currentEnemy);
const rescue = computed(() => {
  return store.currentRoom?.type === 'rescue' && store.currentRoom.name && friendsByName[store.currentRoom.name];
});
const abilities = computed(() => {
  const abilities = [] as Ability[];
  const allAutomatic = !!onboard('Gear of Lords');
  for (let row = 0; row < store.band.height; row++) {
    for (let col = 0; col < store.band.width; col++) {
      const place = col + row * store.band.width;
      const friend = friendsByName[store.band[place]];
      if (!friend) continue;
      const automatic = allAutomatic || !!nextTo('Lord of Gears', row, col);
      const az = nextTo('Azrekta', row, col);
      const abs = (az && friend.super?.abilities) || friend.abilities || [];
      for (const ab of abs) {
        abilities.push({ ...ab, automatic });
        if (automatic) {
          startTimer(ab);
        }
      }
    }
  }
  return abilities;
});

function startTimer(ab: Ability) {
  const key = `ability-${ab.name}`;
  if (!store.run.timers[key]) {
    store.run.timers[key] = {
      duration: ab.duration * 1000,
      time: 0,
      cb: () => executeAbility(ab),
    };
  }
}

function executeAbility(ab: Ability) {
  if (ab.automatic && fighting.value) {
    startTimer(ab);
  }
  if (ab.onCompleted) {
    return ab.onCompleted(store);
  }
  if (ab.damage) {
    damage(ab.damage * store.run.weaponLevel);
  }
}
const fighting = computed(() => {
  return enemy.value && store.run.room.damage < enemy.value.health;
});

function retreat() {
  if (window.confirm("Are you sure you want to retreat?")) {
    store.run = runData();
  }
}
const KEEP_GOING: Turn = { title: 'Keep going', description: 'Continue exploring the dungeon.' };

const possibleTurns = computed(() => {
  const room = store.currentRoom;
  if (room.next) {
    return Object.entries(room.next).map(([title, next]) => ({ ...next, title }));
  }
  if (room.end) {
    return [];
  }
  return [KEEP_GOING];
});

const plannedTurn = computed(() => {
  if (!onboard("Wayfinder") && !onboard("Wayfindest") || !store.destination) return;
  const room = store.currentRoom;
  if (room.end) return;
  const path = destinationToPath(store.destination);
  if (path.length <= store.run.steps + 1) return;
  if (!room.next) return roomKey(room) === roomKey(path[store.run.steps]) ? KEEP_GOING : undefined;
  const nextRoom = path[store.run.steps + 1];
  for (const [title, next] of Object.entries(room.next)) {
    if (nextRoom.label === next.label) {
      return { title, description: next.description };
    }
  }
});

const passiveEffects = computed(() => {
  const effects = [] as string[];
  if (enemy.value?.passiveEffects) {
    effects.push(...enemy.value.passiveEffects);
  }
  for (const name of Object.keys(bandByName.value)) {
    const friend = friendsByName[name];
    if (friend?.passiveEffects) {
      effects.push(...friend.passiveEffects);
    }
  }
  return effects;
});

function reset() {
  if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.") && window.confirm("Double checking: Are you sure you want to reset your progress? This cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
}
</script>

<template>
  <div class="enemy" v-if="enemy">
    <div class="description" v-if="enemy.health > store.run.room.damage">Currently fighting:</div>
    <div class="description" v-else>Defeated! You gained
      <EnemyRewards :enemy="enemy" />.
    </div>
    <h1>{{ enemy.name }}</h1>
    <img :src="`images/generated/${enemy.name}.webp`" :alt="enemy.name"
      :style="enemy.health <= store.run.room.damage && { filter: 'saturate(0.3) contrast(1.5)' }" />
    <Progress :value="enemy.health - store.run.room.damage" :max="enemy.health" color="#c00" label="HP" />
    <Progress v-if="enemy.armor" :value="enemy.armor - store.run.room.armorDamage" :max="enemy.armor" color="#666"
      label="Armor" />
  </div>
  <div class="rescue" v-if="rescue">
    <img :src="`images/generated/${rescue.name}.webp`" :alt="rescue.name" />
    <h1>{{ rescue.name }}</h1>
    <div class="description">Is rescued and joins your band!</div>
    <div class="description" v-html="rescue.descriptionHtml"></div>
  </div>
  <div class="passive-effect" v-for="effect in passiveEffects">
    {{ effect }}
  </div>
  <div class="actions">
    <template v-if="fighting">
      <template v-for="ab in abilities" :key="ab.name">
        <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describeAbility(ab)"
          :cost="ab.consumes?.gold" :image="`images/generated/${ab.image ?? ab.name}.webp`"
          :duration="ab.duration * 1000" @done="executeAbility(ab)" />
      </template>
      <div v-if="store.run.capturedAbilities.length > 0" class="section">Captured Monsters</div>
      <template v-for="ab in store.run.capturedAbilities">
        <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describeAbility(ab)"
          :cost="ab.consumes?.gold" :image="`images/generated/${ab.image ?? ab.name}.webp`"
          :duration="ab.duration * 1000" @done="executeAbility(ab)" />
      </template>
      <div class="section">Navigation</div>
    </template>
    <template v-else-if="plannedTurn">
      <div class="section">Navigation</div>
      <SlowButton timer-key="wayfinder-turn" :duration="1000" :title="plannedTurn.title!"
        :description="plannedTurn.description" :image="`images/generated/${plannedTurn.title}.webp`"
        @done="takeTurn(plannedTurn.title!, true)" :autostart="true" />
    </template>
    <template v-else>
      <div class="section">Navigation</div>
      <button v-for="turn in possibleTurns" :key="turn.title" @click="takeTurn(turn.title!, turn.skipConfirmation)">
        <img :src="`images/generated/${turn.title}.webp`" />
        <div class="text">
          <div class="title">{{ turn.title }}</div>
          <div class="description">{{ turn.description }}</div>
        </div>
      </button>
    </template>
    <button @click="retreat()" v-if="store.run.steps > 0">
      <img src="/images/generated/Retreat.webp" />
      <div class="text">
        <div class="title">Retreat</div>
        <div class="description">
          Leave the dungeon and return to safety. Live to fight another day.
          <template v-if="store.run.gold > 0 && store.run.fruit > 0">
            You will lose
            <Gold :amount="store.run.gold" /> but keep the
            <Fruit :amount="store.run.fruit" /> you've collected.
          </template>
          <template v-else-if="store.run.gold > 0">
            You will lose
            <Gold :amount="store.run.gold" />.
          </template>
          <template v-else-if="store.run.fruit > 0">
            You keep the
            <Fruit :amount="store.run.fruit" /> you've collected.
          </template>
        </div>
      </div>
    </button>
    <button @click="reset()">
      <img src="/images/generated/reset.webp" />
      <div class="text">
        <div class="title">Reset data</div>
        <div class="description">
          Throw away all your progress and start over.
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
    transition: filter 2s;
  }
}

.rescue {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  border-radius: 10px;
  padding: 10px 30px;
  padding-top: 0;
  margin: 10px 0;

  img {
    width: 200px;
    mix-blend-mode: lighten;
    margin-top: -45px;
  }

  h1 {
    margin-top: -15px;
    margin-bottom: 0px;
  }
}

.actions {
  margin: 20px 0;
  columns: 310px auto;
  width: 100%;

  .section {
    display: block;
    color: #edb;
    break-after: avoid;
  }

  .section:before,
  .section:after {
    content: ' — ';
  }
}

.actions>* {
  display: flex;
  margin: 0 auto;
  margin-bottom: 10px;
}

.passive-effect {
  color: #edb;
  margin-top: 10px;
}
</style>
