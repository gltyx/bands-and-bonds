<script setup lang="ts">
import { computed, ref } from "vue";
import SlowButton from "./SlowButton.vue";
import { store, describeAbility, friendAt, nextTo, onboard } from "../store.ts";
import { friendsByName } from "../friends.ts";
import Fruit from "./Fruit.vue";
import Packs from "./Packs.vue";
import { costOfPacks } from "../base.ts";

const selected = ref(undefined as string | undefined);

function imageFor(row: number, col: number): string | undefined {
  const friend = friendAt(row, col);
  if (!friend) return undefined;
  const imageName = nextTo('Azrekta', row, col) && friend.super?.name || friend.name;
  return `images/generated/${imageName}.webp`;
}
function available(row: number, col: number): boolean {
  const dist = Math.max(Math.abs(row - 2), Math.abs(col - 2));
  if (lightRadius.value === 'radius3') return true;
  if (lightRadius.value === 'radius2') return dist <= 1;
  return dist === 0;
}
function remove(key: number) {
  const name = store.local.band[key];
  const friend = friendsByName[name];
  if (friend.super?.name && onboard(friend.super.name)) {
    friend.super.onRemoved?.(store);
  } else {
    friend.onRemoved?.(store);
  }
  delete store.local.band[key];
}
function set(row: number, col: number, name: string) {
  if (!enabled.value) return;
  const cost = friendsByName[name]?.cost ?? 0;
  if (store.team.packs >= packsSpent.value + cost && !onboard(name) && available(row, col)) {
    store.local.band[col + row * store.local.band.width] = name;
    const friend = friendsByName[name];
    if (friend.super?.name && onboard(friend.super.name)) {
      friend.super.onAdded?.(store);
    } else {
      friend.onAdded?.(store);
    }
  }
}
function clear(row: number, col: number) {
  if (!enabled.value) return;
  selected.value = friendAt(row, col)?.name;
  if (!selected.value) return;
  const band = store.local.band;
  remove(col + row * band.width);
  // Drop anyone who is now on unlit tiles.
  for (let r = 0; r < band.height; r++) {
    for (let c = 0; c < band.width; c++) {
      if (!available(r, c)) {
        const place = c + r * band.width;
        const friend = band[place];
        if (friend) {
          remove(place);
        }
      }
    }
  }
}

const lightRadius = computed(() => {
  const lamplighter = friendAt(2, 2)?.name === 'Lamplighter';
  if (!lamplighter) return 'radius1';
  if (nextTo('Azrekta', 2, 2)) {
    return 'radius3';
  }
  return 'radius2';
});

const selectedFriend = computed(() => {
  const band = store.local.band;
  for (let row = 0; row < band.height; row++) {
    for (let col = 0; col < band.width; col++) {
      const place = col + row * band.width;
      const name = band[place];
      const friend = friendsByName[name];
      if (name === selected.value) {
        if (nextTo('Azrekta', row, col)) {
          return { ...friend, ...friend.super };
        }
        return friend;
      }
    }
  }
  return selected.value ? friendsByName[selected.value] : undefined;
});

function friendClicked(row: number, col: number) {
  const friend = friendAt(row, col);
  if (selected.value === friend?.name) {
    clear(row, col);
  } else {
    selected.value = friend?.name;
  }
}

const packsSpent = computed(() => {
  let spent = 0;
  for (const name of Object.values(store.local.band)) {
    const friend = friendsByName[name];
    if (friend) {
      spent += friend.cost;
    }
  }
  return spent;
});

type Bond = {
  image: string;
  style: string;
};

const bonds = computed(() => {
  const bonds: Bond[] = [];
  const band = store.local.band;
  for (let row = 0; row < band.height; row++) {
    for (let col = 0; col < band.width; col++) {
      const place = col + row * band.width;
      if (!band[place]) continue;
      for (const name of ['Azrekta', 'Lord of Gears', 'The Silent Song']) {
        const bond = nextTo(name, row, col);
        if (bond) {
          bonds.push({
            image: 'chain',
            style: bond[0] === row ?
              `left: ${(col + bond[1] + 1) * 103 / 2 - 15}px; top: ${(row + 0.5) * 103 - 15}px; transform: rotate(90deg);` :
              `left: ${(col + 0.5) * 103 - 15}px; top: ${(row + bond[0] + 1) * 103 / 2 - 15}px;`,
          });
        }
      }
    }
  }
  return bonds;
});

const unusedFriends = computed(() => {
  const used = new Set(Object.values(store.local.band));
  const unused = store.team.unlocked.filter(name => !used.has(name));
  unused.sort();
  return unused;
});

function buyPack() {
  if (store.team.fruit >= costOfPacks(store.team.packs + 1)) {
    store.team.packs += 1;
  }
}

const enabled = computed(() => {
  if (store.run.steps === 0) return true;
  if (onboard('Wayfinder')) {
    const room = store.currentRoom();
    return room.type === 'rescue';
  }
  return false;
});
</script>

<template>
  <p>
    The <u contenteditable="true">Unnamed Band</u> is assembled at a total cost of
    <Packs :amount="packsSpent" />,
    leaving you with
    <Packs :amount="store.team.packs - packsSpent" />
    to hire more members.
    <button class="buy-pack-button" @click="buyPack()"
      :class="{ unaffordable: store.team.fruit < costOfPacks(store.team.packs + 1) }">Buy
      <Packs :amount="1" />
      for
      <Fruit :amount="costOfPacks(store.team.packs + 1) - costOfPacks(store.team.packs)" />
    </button>
  </p>
  <div class="band-grid" :class="{ enabled, disabled: !enabled }">
    <img class="light-ring" :src="`images/generated/light-ring.webp`" :class="lightRadius" />
    <div class="band-row" v-for="(_, row) in store.local.band.height" :key="row">
      <template v-for="(_, col) in store.local.band.width" :key="col">
        <button v-if="friendAt(row, col)" class="band-cell" :class="{ unavailable: !available(row, col) }"
          @click="friendClicked(row, col)" :aria-label="friendAt(row, col)?.name ?? ''">
          <img v-if="friendAt(row, col)" :src="imageFor(row, col)" />
        </button>
        <button v-else-if="available(row, col)" class="band-cell" @click="selected && set(row, col, selected)"
          aria-label="+">
          ＋
        </button>
        <button v-else class="band-cell unavailable">
        </button>
      </template>
    </div>
    <img v-for="bond in bonds" class="chain" :src="`images/generated/${bond.image}.webp`" :style="bond.style" />
  </div>
  <p v-if="!enabled" class="description" style="color: #edb; margin-bottom: 0;">
    You cannot change your band now. Enemies are nearby. Retreat to a safe place to make changes.
  </p>
  <div class="below-grid">
    <div class="band-unlocked" v-show="unusedFriends.length > 0">
      <template v-for="name in unusedFriends" :key="name">
        <button class="band-cell" @click="selected = name" :aria-label="name"
          :class="{ unaffordable: store.team.packs < friendsByName[name].cost + packsSpent, unfinished: !friendsByName[name].finished }">
          <img :src="`images/generated/${name}.webp`" />
        </button>
      </template>
    </div>
    <div class="band-details" v-if="selected && selectedFriend">
      <div class="friend-cost numbers"
        :class="{ unaffordable: store.team.packs < selectedFriend.cost + packsSpent && !onboard(selected) }">
        {{ selectedFriend?.cost ?? 0 }} <img src="/images/generated/pack.webp" class="resource-icon" />
      </div>
      <img :src="`images/generated/${selectedFriend.name}.webp`" />
      <h1>{{ selectedFriend.name }}</h1>
      <div class="description" v-html="selectedFriend.descriptionHtml"></div>
      <template v-for="ab in selectedFriend.abilities" :key="ab.name">
        <SlowButton :timer-key="`ability-${ab.name}`" :title="ab.name" :description="describeAbility(ab)"
          :image="`images/generated/${ab.name}.webp`" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.band-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 10px;
  position: relative;
}

.band-row {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.band-cell {
  width: 100px;
  height: 100px;
  margin: 0;
  padding: 10px;
  color: #333;
  background-color: #000;
  border-radius: 10px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    border: 0;
  }
}

u {
  font-size: 1.2em;
}

.band-cell.unavailable {
  border: 0;
  visibility: hidden;
}

.band-cell.unaffordable {
  border: 0.5px solid #f00;
}

.light-ring.radius1 {
  width: 110px;
}

.light-ring.radius2 {
  width: 316px;
}

.light-ring.radius3 {
  width: 522px;
}

.light-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 10px;
}

.chain {
  position: absolute;
  top: 293px;
  left: 241px;
  width: 30px;
  height: 30px;
  z-index: 3;
}

.band-unlocked {
  flex: 1 1;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  min-width: 350px;
}

.unfinished {
  opacity: 0.3;
}

.band-details {
  flex: 1 1;
  background-color: #000;
  border-radius: 30px;
  margin: 20px 0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  >img {
    width: 200px;
    /* to make room for the cost */
    margin: 0 30px;
    mix-blend-mode: lighten;
    margin-top: -45px;
  }

  h1 {
    margin-top: -15px;
    margin-bottom: 0;
  }

  .description {
    margin-bottom: 20px;
  }

  .friend-cost {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .friend-cost.unaffordable {
    color: red;
  }

}

.below-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 20px;
}

h2 {
  margin-bottom: 0;
  font-family: 'Grenze Gotisch', serif;
  font-weight: 200;
}

.friend-cost {
  font-size: 18px;
}

.buy-pack-button {
  width: auto;
  font-size: 15px;
}

.buy-pack-button.unaffordable .numbers {
  color: red;
}

.disabled button:hover {
  border-color: black;
}

.disabled button {
  outline: 0;
  cursor: default;
}
</style>
