<script setup lang="ts">
import * as st from "../store.ts";
import { friendsByName } from "../friends.ts";
import { enemiesByName } from "../enemies.ts";
import { roomsByKey } from "../rooms.ts";
import { numberFormat, durationFormat, type Ability } from "../base.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed, ref } from "vue";
import EnemyRewards from "./EnemyRewards.vue";
import Fruit from "./Fruit.vue";
import Num from "./Num.vue";
import Victory from "./Victory.vue";
import { allTips } from "../tips.ts";

const store = st.store;
const enemy = computed(() => store.currentEnemy());
const fighting = computed(() => {
  return enemy.value && store.run.room.damage < enemy.value.health;
});

const possibleTurns = computed(() => {
  const room = store.currentRoom();
  if (room.next) {
    return Object.entries(room.next).map(([title, next]) => ({ ...next, title }));
  }
  if (room.end) {
    return [];
  }
  return [{ ...st.KEEP_GOING, leadsTo: room.leadsTo }];
});

const passiveEffects = computed(() => {
  const effects = [] as string[];
  for (const name in store.bandByName()) {
    const friend = friendsByName[name];
    if (friend?.passiveEffects) {
      effects.push(...friend.passiveEffects);
    }
  }
  if (!enemy.value) return effects;
  const count = enemy.value.count ?? 1;
  const alive = store.run.room.damage < enemy.value.health;
  if (enemy.value.name === 'Skelemasterion' && !alive && !store.run.capturedMonsters.includes('Skelemasterion')) {
    return ['Skelemasterion is defeated. You search its lair and collect its treasure. Yet you miss something that only Skelemasterion could reveal.'];
  }
  const s = count > 1 ? '' : 's';
  const is = count > 1 ? (alive ? 'are' : 'were') : (alive ? 'is' : 'was');
  effects.push(...enemy.value.passiveEffects ?? []);
  const weaknesses = st.getWeaknesses(enemy.value);
  if (enemy.value.immune) {
    const attacks = [];
    for (const i of enemy.value.immune) {
      if (!weaknesses.includes(i)) {
        attacks.push(`<span class="tag ${i}"></span><u>${i} attacks</u>`);
      }
    }
    if (attacks.length > 0) {
      effects.push(
        `${enemy.value.name} ${is} immune to ${attacks.join(' and ')}.`);
    }
  }
  if (enemy.value.dodge) {
    effects.push(
      `${enemy.value.name} dodge${s} attacks that take longer
      than <span class="numbers">${durationFormat(1000 * enemy.value.dodge)}</span>.
      Faster attacks have a chance to hit.`);
  }
  if (st.ethereal.value) {
    effects.push(
      `Enem${count > 1 ? 'ies' : 'y'} ${is} ethereal${enemy.value.ethereal ? "" : " due to Azrekta's presence"}.
      Attacks ${alive ? 'will often miss.' : 'have often missed.'}`);
  }
  if (st.onboard("Desert Rabbit")) {
    const weak = [];
    for (const weakness of weaknesses) {
      if (['left', 'right', 'front', 'back'].includes(weakness)) {
        weak.push(`<u>attacks from the ${weakness}</u>`);
      } else {
        weak.push(`<span class="tag ${weakness}"></span><u>${weakness} attacks</u>`);
      }
    }
    if (weak.length > 0) {
      const animal = st.onboard("Desert Armadillo") ? 'Desert Armadillo' : 'Desert Rabbit';
      effects.push(`${animal} tells you that ${enemy.value.name} ${is} weak to ${weak.join(' and ')}.`);
    }
  }
  return effects;
});

const tip = computed(() => {
  if (!st.rescuedFriend.value) return;
  const possibleTips = allTips.filter(t => store.onboard(t.friend) && (t.enabled === undefined || t.enabled(store)));
  const i = Math.floor(Math.random() * possibleTips.length);
  const t = possibleTips[i];
  // Use the super name, if that's who we have in the band.
  return { ...t, friend: store.onboard(t.friend)?.name };
});
const retreatConfirmation = ref(false);
function retreat() {
  if (retreatConfirmation.value) {
    st.retreat();
    retreatConfirmation.value = false;
  } else {
    retreatConfirmation.value = true;
  }
}

function slowButtonProps(ab: Ability) {
  return {
    title: ab.name,
    description: st.describeAbility(ab, st.abilityEffects(ab)),
    cost: st.abilityCost(ab),
    image: `images/generated/${ab.image ?? ab.name}.webp`,
    duration: st.abilityDuration(ab) * 1000,
    autostart: ab.automatic,
    affectedBySpeedLevel: ab.affectedBySpeedLevel ?? !ab.peaceful,
    tags: st.onboard('Desert Rabbit') && st.abilityTags(ab),
  };
}

function nth(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${numberFormat(n)}<sup>${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}</sup>`;
}

function preloadImage(url: string) {
  const img = new Image();
  img.src = url;
}

const hideActions = ref(false);

// Preload images.
for (const url of [
  'images/generated/victory1.webp',
  'images/generated/victory2.webp',
  'images/generated/victory3.webp',
  'images/generated/victory4.webp',
]) {
  preloadImage(url);
}
for (const friend of Object.values(friendsByName)) {
  preloadImage(`images/generated/${friend.name}.webp`);
  for (const ability of friend.abilities ?? []) {
    preloadImage(`images/generated/${ability.image ?? ability.name}.webp`);
  }
  if (friend.super?.name) {
    preloadImage(`images/generated/${friend.super.name}.webp`);
    for (const ability of friend.super.abilities ?? []) {
      preloadImage(`images/generated/${ability.image ?? ability.name}.webp`);
    }
  }
}
for (const enemy of Object.values(enemiesByName)) {
  preloadImage(`images/generated/${enemy.name}.webp`);
}
</script>

<template>
  <div class="enemy" v-if="enemy">
    <template v-if="enemy.count && enemy.count > 1">
      <div class="description" v-if="store.run.room.kills < enemy.count">Currently fighting the
        <span class="numbers" v-html="nth(store.run.room.kills + 1)" /> of
        <Num :amount="enemy.count" />
      </div>
      <div class="description" v-else>Defeated
        <Num :amount="enemy.count" />enemies! You gained
        <EnemyRewards :enemy="enemy" />.
      </div>
    </template>
    <template v-else>
      <div class="description" v-if="enemy.health > store.run.room.damage">Currently fighting:</div>
      <div class="description" v-else>Defeated! You gained
        <EnemyRewards :enemy="enemy" />.
      </div>
    </template>
    <h1>{{ enemy.name }}</h1>
    <img :src="`images/generated/${enemy.name}.webp`" :alt="enemy.name" :key="enemy.name"
      :class="{ ethereal: st.ethereal.value }"
      :style="enemy.health <= store.run.room.damage && { filter: 'saturate(0.3) contrast(1.5)' }" />
    <Progress :value="enemy.health - store.run.room.damage" :max="enemy.health" color="#c00" label="HP" />
    <Progress v-if="enemy.armor" :value="enemy.armor - store.run.room.armorDamage" :max="enemy.armor" color="#666"
      label="Armor" title="Armor is subtracted from damage" />
  </div>
  <Transition mode="out-in">
    <div key="just-rescued" class="just-rescued" v-if="st.justRescued.value">
      <img :src="`images/generated/${st.justRescued.value?.name}.webp`" :alt="st.justRescued.value?.name"
        class="friend" />
      <h1>{{ st.justRescued.value?.name }}</h1>
      <p class="description is-rescued" style="margin-top: 0; text-align: center; color: #edb;">is rescued!</p>
      <div class="description" v-html="st.justRescued.value?.descriptionHtml"></div>
    </div>
    <div key="rescue-available" class="rescue-available scene" v-else-if="st.rescueAvailable.value">
      <img src="/images/generated/rescue-locked.webp" alt="A creature in a cage" />
      <h1>Prisoner found</h1>
      <p class="description">You see a hooded figure in a cage. Will you let them out?</p>
    </div>
    <div key="rescued-earlier" class="scene" v-else-if="st.rescuedFriend.value">
      <img src="/images/generated/camp.webp" alt="Adventurers around a campfire" />
      <h1>Camping</h1>
      <p class="description">You rescued {{ st.rescuedFriend.value?.name }} here earlier. You stop to recover your
        strength.
      </p>
      <div class="callout" v-if="tip">
        <p class="description" v-html="tip.text" />
        <img class="friend" :src="`images/generated/${tip.friend}.webp`" />
      </div>
    </div>
  </Transition>
  <div class="passive-effect" v-for="effect in passiveEffects" v-html="effect" />
  <Victory :show="!!store.run.timers.celebrating" @on-start="hideActions = true;" @on-end="hideActions = false;" />
  <div class="actions" v-show="!hideActions">
    <template v-for="ab in st.abilities.value" :key="ab.name">
      <SlowButton v-if="store.run.steps > 0 && (fighting || ab.peaceful)" :timer-key="`ability-${ab.name}`"
        v-bind="slowButtonProps(ab)" />
    </template>
    <div v-if="store.run.capturedMonsters.length > 0" class="section">Captured Monsters</div>
    <template v-for="monster in store.run.capturedMonsters" :key="monster">
      <template v-for="ab in enemiesByName[monster].abilities" :key="ab.name">
        <SlowButton v-if="store.run.steps > 0 && (fighting || ab.peaceful)"
          :timer-key="`monster-${monster}-ability-${ab.name}`" v-bind="slowButtonProps(ab)" />
      </template>
    </template>
    <template v-if="fighting">
      <div class="section">Navigation</div>
    </template>
    <SlowButton v-else-if="st.rescueAvailable.value" timer-key="rescue-unlock" :duration="8000" title="Rescue prisoner"
      description="Release the poor creature." image="images/generated/rescue-unlock.webp" />
    <template v-else-if="st.plannedTurn.value">
      <div class="section">Navigation</div>
      <SlowButton v-if="!hideActions" timer-key="wayfinder-turn" :duration="1000" :title="st.plannedTurn.value?.title!"
        :description="st.plannedTurn.value?.description" :image="`images/generated/${st.plannedTurn.value?.title}.webp`"
        :autostart="true" />
    </template>
    <template v-else>
      <div class="section">Navigation</div>
      <button v-for="turn in possibleTurns" :key="turn.title" @click="store.takeTurn(turn.title!)">
        <img
          :src="`images/generated/${(turn.leadsTo && store.team.discovered.includes(turn.leadsTo)) ? roomsByKey[turn.leadsTo].name : turn.title}.webp`"
          :class="{ 'turn': true, 'leads-to': turn.leadsTo && store.team.discovered.includes(turn.leadsTo) }" />
        <div class="text">
          <div class="title">{{ turn.title }}</div>
          <div class="description">
            <p>{{ turn.description }}</p>
          </div>
        </div>
      </button>
    </template>
    <button @click="retreat()" @blur="retreatConfirmation = false" accesskey="r" v-if="store.run.steps > 0">
      <img src="/images/generated/Retreat.webp" />
      <div class="text">
        <div class="title">Retreat</div>
        <div class="description">
          <p>
            Leave the dungeon and return to safety.
            <template v-if="store.run.fruit > 0">
              You start over, but keep the
              <Fruit :amount="store.run.fruit" /> you've collected.
              Spend it on your band!
            </template>
          </p>
          <p v-if="retreatConfirmation">Click again to confirm.</p>
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
    margin-top: 0;
    margin-bottom: 10px;
  }

  img {
    transition: filter 2s;
  }
}

.enemy>img,
.scene>img {
  width: 100px;
  height: 100px;
  border-radius: 40%;
  border: 2px outset #edb;
  box-shadow: 0 0 10px #000;
}

.enemy img.ethereal {
  border-top-color: #ace;
  border-left-color: #e8c;
  border-bottom-color: #e8c;
  border-right-color: #8af;
}

.rescue-available {
  transition: opacity 1s linear;

  img {
    transition: filter 1s linear;
    filter: invert(0) brightness(1);
  }
}

.rescue-available.v-leave-to {
  img {
    filter: invert(0.5) brightness(2);
  }
}

.just-rescued.v-enter-active img.friend {
  animation: rescue-reveal 3s;
}

.just-rescued.v-enter-active h1,
.just-rescued.v-enter-active .description.is-rescued {
  animation: rescue-reveal-text-1 3s;
}

.just-rescued.v-enter-active .description {
  animation: rescue-reveal-text-2 3s;
}

.just-rescued.v-enter-active {
  animation: rescue-reveal-background 3s;
}

@keyframes rescue-reveal-background {
  0% {
    background-color: #fff;
  }

  5% {
    background-color: #fff;
  }

  60% {
    background-color: #000;
  }

  100% {
    background-color: #000;
  }
}

@keyframes rescue-reveal {
  0% {
    filter: saturate(0) sepia(0) hue-rotate(720deg) brightness(2);
  }

  20% {
    filter: saturate(0) sepia(0) hue-rotate(720deg) brightness(2);
  }

  30% {
    filter: saturate(1) sepia(1) hue-rotate(720deg) brightness(2);
  }

  45% {
    filter: saturate(1) sepia(1) hue-rotate(360deg) brightness(1);
  }

  60% {
    filter: none;
  }

  100% {
    filter: none;
  }
}

@keyframes rescue-reveal-text-1 {
  0% {
    opacity: 0;
  }

  60% {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }
}

@keyframes rescue-reveal-text-2 {
  0% {
    opacity: 0;
  }

  80% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.just-rescued {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  border-radius: 10px;
  padding: 10px 30px;
  padding-top: 0;
  margin: 10px 0;
  max-width: 600px;

  h1 {
    margin-top: -15px;
    margin-bottom: 0px;
  }
}

.scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;

  h1 {
    margin: 0px;
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

.leads-to {
  filter: brightness(90%) sepia(90%) hue-rotate(80deg) saturate(200%);
}
</style>
