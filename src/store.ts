import { computed, reactive, watch } from 'vue';
import { allRooms, turnsToPath, roomKey } from './rooms.ts';
import { allEnemies } from './enemies.ts';
import { allFriends, friendsByName } from './friends.ts';
import { type DecoratedStore, numberFormat, type Ability, type Friend, type Store, type RoomData, type RunData, type Timer, type Band } from './base';

export function roomData(): RoomData {
  // Everything specific to the current room. Deleted when leaving the room.
  return {
    damage: 0,
    armorDamage: 0,
    poison: 0,
    kills: 0,
  };
}
export function runData(): RunData {
  // Everything specific to the current run. Deleted when the run ends.
  return {
    weaponLevel: 1,
    speedLevel: 1,
    steps: 0,
    turns: [],
    gold: 0,
    fruit: 0, // Fruit collected in this run. Only for statistics.
    capturedAbilities: [],
    room: roomData(),
    timers: {} as Record<string, Timer>,
  };
}

function startingBand(): Band {
  return {
    width: 5,
    height: 5,
    12: 'Stick Master',
  };
}
function startingUnlocked(): string[] {
  return allFriends.map((f) => f.name);
}
function startingDiscovered(): string[] {
  return allRooms.map(roomKey);
}

const loadedStore = localStorage.getItem('store');
export const store = reactive<Store>(loadedStore ? JSON.parse(loadedStore) : {
  run: runData(),
  band: startingBand(),
  fruit: 999,
  packs: 999,
  unlocked: startingUnlocked(),
  discovered: startingDiscovered(),
});
watch(store, (newValue) => {
  localStorage.setItem('store', JSON.stringify(newValue))
}, { deep: true });

const current = computed(() => {
  const path = turnsToPath(store.run.steps, store.run.turns);
  const room = path[path.length - 1];
  const enemy = ['combat', 'boss', 'finalboss'].includes(room.type) ? allEnemies.find((e) => e.name === room.name) : undefined;
  return { path, room, enemy };
});
export const decoratedStore = new Proxy(store, {
  get(target, p, receiver) {
    if (p === 'currentRoom') {
      return current.value.room ?? allRooms[0];
    }
    if (p === 'currentEnemy') {
      return current.value.enemy;
    }
    if (p === 'currentPath') {
      return current.value.path ?? allRooms[0];
    }
    if (p === 'damage') {
      return damage;
    }
    return Reflect.get(target, p, receiver);
  },
}) as DecoratedStore;

export function damage(x: number) {
  const enemy = decoratedStore.currentEnemy;
  if (!enemy) return;
  if (store.run.room.damage >= enemy.health) return; // Already defeated.
  let dmg = x;
  const capturing = onboard("Mongreler") || onboard("Monster Juggler");
  if (capturing) {
    dmg *= 0.01;
  }
  dmg -= (enemy.armor ?? 0) - store.run.room.armorDamage;
  if (dmg < 0) return;
  store.run.room.damage += dmg;
  if (store.run.room.damage >= enemy.health) {
    store.run.room.kills += 1;
    const remaining = (enemy.count ?? 1) - store.run.room.kills;
    if (remaining > 0) {
      store.run.room.damage = 0;
      store.run.room.armorDamage = 0;
      store.run.room.poison = 0;
    } else {
      store.run.room.damage = enemy.health;
      store.run.room.poison = 0;
      store.run.gold += enemy.rewards?.gold ?? 0;
      let fruit = enemy.rewards?.fruit ?? 0;
      if (onboard("Royal Fruitbearer")) {
        fruit *= Object.keys(bandByName.value).length;
      }
      if (onboard("Royal Fruitwearer")) {
        fruit *= Object.keys(bandByName.value).length;
        fruit *= Object.keys(bandByName.value).length - 1;
      }
      store.run.fruit += fruit;
      store.fruit += fruit;
      if (capturing) {
        store.run.capturedAbilities.push(...enemy.abilities ?? []);
      }
    }
  }
}

export function takeTurn(turn: string, skipConfirmation?: boolean) {
  if (!skipConfirmation && !window.confirm(`${turn}?`)) return;
  store.run.room = roomData();
  store.run.steps += 1;
  if (turn !== 'Keep going') {
    store.run.turns.push(turn);
  }
  let path = turnsToPath(store.run.steps, store.run.turns);
  let room = path[path.length - 1];
  while (room.type === 'none' && !room.next) {
    // Skip rooms with nothing to do.
    store.run.steps += 1;
    path = turnsToPath(store.run.steps, store.run.turns);
    room = path[path.length - 1];
  }
  if (!store.discovered.includes(roomKey(room))) {
    store.discovered.push(roomKey(room));
  }
  if (room.type === 'rescue' && room.name && !store.unlocked.includes(room.name)) {
    store.unlocked.push(room.name);
  }
}

export function describeAbility(ab: Ability): string {
  let d = ab.description;
  if (typeof d === "function") {
    d = d(decoratedStore);
  }
  if (ab.damage) {
    d += `\n\n${numberFormat(ab.damage * store.run.weaponLevel)} damage`;
  }
  return d;
}

export const bandByName = computed(() => {
  const byName = {} as Record<string, { row: number, col: number }>;
  for (let row = 0; row < store.band.height; row++) {
    for (let col = 0; col < store.band.width; col++) {
      const place = col + row * store.band.width;
      const n = store.band[place];
      if (n) {
        byName[n] = { row, col };
      }
    }
  }
  const az = byName.Azrekta;
  if (az) {
    for (const [row, col] of [[az.row - 1, az.col], [az.row + 1, az.col], [az.row, az.col - 1], [az.row, az.col + 1]] as [number, number][]) {
      const place = col + row * store.band.width;
      const n = store.band[place];
      if (!n) continue;
      const friend = friendsByName[n];
      if (friend?.super?.name) {
        delete byName[friend.name];
        byName[friend.super.name] = { row, col };
      }
    }
  }
  return byName;
});

export function friendAt(row: number, col: number): Friend | undefined {
  return friendsByName[store.band[col + row * store.band.width]];
}
export function nextTo(name: string, row: number, col: number): [number, number] | null {
  const b = bandByName.value[name];
  return b && Math.abs(b.row - row) + Math.abs(b.col - col) === 1 ? [b.row, b.col] : null;
}
export function onboard(name: string): { row: number, col: number } | undefined {
  return bandByName.value[name];
}
