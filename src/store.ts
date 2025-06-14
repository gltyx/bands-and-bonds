import { reactive, watch } from 'vue';
import { allRooms, getPath } from './rooms.ts';

export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
  [x: string]: unknown;
};

export type Band = {
  width: number;
  height: number;
  light: { [x: number]: number };
  [x: number]: string;
}
export type Ability = {
  name: string;
  description: string | (() => string);
  duration: number;
  damage?: number;
  consumes?: { [x: string]: number };
  onCompleted?: () => void;
};

export type Friend = {
  description?: string;
  abilities?: Ability[];
  onAdded?: (band: Band, row: number, col: number) => void;
  onRemoved?: (band: Band, row: number, col: number) => void;
}

export type Enemy = {
  name: string;
  health: number;
  armor?: number;
  immune?: string[];
  regen?: number;
};
export const allEnemies: Enemy[] = [
  { name: 'Wild Slime', health: 30 },
  { name: 'Poison Crow', health: 50 },
  { name: 'Animated Skeleton', health: 100, immune: ['poison'] },
  { name: 'Jaw Maw Maw', health: 100 },
  { name: 'Clockomancer', health: 100, immune: ['speed'] },
  { name: 'Lobster Daddy', health: 100, armor: 1000 },
  { name: 'Trollish Maiden', health: 100, regen: 10 },
  { name: 'The Shroud', health: 1000 },
  { name: 'Dark Lord', health: 10000, armor: 100 },
  { name: 'Glass Dragon', health: 100000 },
  { name: 'Xaranthian Construct', health: 1000000 },
];

export const friends: Record<string, Friend> = {
  'Anvilomancer': {
    description: "An expert Anvilomancer can upgrade your weapons in the midst of battle.",
    abilities: [{
      name: "Forge",
      duration: 5,
      consumes: { metal: 1 },
      description: () => `Increases the level of all weapons. (Currently ${store.run.weaponLevel}.)`,
      onCompleted: () => { store.run.weaponLevel += 1; },
    },
    {
      name: "Unforge",
      duration: 5,
      description: "Damages the armor of the enemy.",
      onCompleted: () => { store.run.armorDamage = Math.min(store.run.enemy?.armor ?? 0, store.run.armorDamage + 1); },
    }],
  },
  'Azrekta': {
    description: `
Azrekta is a fierce warrior with a cold blade, known for her swift and deadly strikes.
Azrekta is a fierce warrior with a cold blade, known for her swift and deadly strikes.
Azrekta is a fierce warrior with a cold blade, known for her swift and deadly strikes.

Abilities:
- Magic.
- Cuteness.
    ` },
  'Coldblade': {},
  'Dark Chef': {
    description: "A master of the culinary arts, Dark Chef fights by poisoning the enemies.",
    abilities: [{
      name: "Poison Strike",
      duration: 5,
      description: "Damage over time.",
      onCompleted() {
        store.run.poison += store.run.weaponLevel;
      },
    }],
  },
  'Desert Rabbit': {
    description: "The Desert Rabbit is a master of traversing hostile environments. Having him in your band makes it possible to change the band composition at campfires.",
  },
  'Friend of Metal and Fire': {},
  'Friend of Metal': {},
  'Knight of Claws': {},
  'Lamplighter': {
    description: "Lights up tiles around it, letting you extend your band.",
    onAdded: (band: Band, row: number, col: number) => {
      for (const p of neighbors(band, row, col)) {
        band.light[p] = (band.light[p] ?? 0) + 1;
      }
    },
    onRemoved: (band: Band, row: number, col: number) => {
      for (const p of neighbors(band, row, col)) {
        band.light[p] -= 1;
        if (band.light[p] === 0 && band[p]) {
          store.unassigned.push(band[p]);
          delete band[p];
        }
      }
    },
    abilities: [{
      name: "Illuminate",
      duration: 1,
      damage: 2,
      description: "Shines a light on the battlefield, damaging all enemies.",
    }],
  },
  'Royal Fruitbearer': {},
  'Stick Grandmaster': {},
  'Stick Master': {
    description: "Stick Master is a master of **the wooden stick**, using it to _whack enemies_ with precision and skill.",
    abilities: [{
      name: "Wooden Stick",
      duration: 0.5,
      damage: 1,
      description: "Whack it with a stick.",
    }],
  },
  'The Silent Song': {},
  'Lord of Gears': {},
  'Pur Lion': {
    description: "A thief, wanted in all the thirty kingdoms. Yet nobody is able to give an accurate description of him. He has the ability to _snatch_ items from enemies in the fray of the battle.",
    abilities: [{
      name: "Snatch",
      duration: 0.5,
      description: "Steals a piece of metal.",
      onCompleted() {
        store.run.metal += 1;
      },
    }],
  },
  'Kit Flash': {
    description: "A wizard of speed, Kit Flash can _run_ faster than the eye can see. He is able to speed up the abilities of every member of the band.",
    abilities: [{
      name: "Running Start",
      duration: 10,
      description: () => `Speed up all abilities. (Currently ${store.run.speedLevel}×.)`,
      onCompleted() {
        store.run.speedLevel += 1;
      },
    }],
  },
};

export function roomData() {
  // Everything specific to the current room. Deleted when leaving the room.
  return {
    damage: 0,
    armorDamage: 0,
    poison: 0,
    timers: {} as Record<string, Timer>,
  };
}
export function runData() {
  // Everything specific to the current run. Deleted when the run ends.
  return {
    weaponLevel: 1,
    speedLevel: 1,
    steps: 0,
    turns: [] as string[],
    metal: 0,
    // Precomputed for convenience.
    room: allRooms[0],
    enemy: undefined as Enemy | undefined,
    ...roomData(),
  };
}

function startingBand(): Band {
  return {
    width: 5,
    height: 5,
    light: { 12: 1 },
    12: 'Stick Master',
  };
}
function startingUnlocked(): string[] {
  return Object.keys(friends);
}

export type Store = {
  run: ReturnType<typeof runData>;
  band: Band;
  unlocked: string[];
  unassigned: string[];
};

const loadedStore = localStorage.getItem('store');
export const store = reactive<Store>(loadedStore ? JSON.parse(loadedStore) : {
  run: runData(),
  band: startingBand(),
  unlocked: startingUnlocked(),
  unassigned: [] as string[],
});
watch(store, (newValue) => {
  localStorage.setItem('store', JSON.stringify(newValue))
}, { deep: true });

function neighbors(band: Band, row: number, col: number): number[] {
  const result: number[] = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < band.height && c >= 0 && c < band.width) {
        result.push(r * band.width + c);
      }
    }
  }
  return result;
}

export function damage(x: number) {
  const enemy = store.run.enemy;
  if (!enemy) return;
  let dmg = x;
  dmg -= (enemy.armor ?? 0) - store.run.armorDamage;
  if (dmg < 0) return;
  store.run.damage += dmg;
  if (store.run.damage >= enemy.health) {
    store.run.damage = enemy.health;
    store.run.poison = 0;
  }
}

export function takeTurn(turn: string) {
  if (!window.confirm(`${turn}?`)) return;
  store.run = { ...store.run, ...roomData() };
  store.run.steps += 1;
  if (turn !== 'Keep going') {
    store.run.turns.push(turn);
  }
  let path = getPath(store.run.steps, store.run.turns);
  let room = path[path.length - 1];
  while (room.type === 'none' && !room.next) {
    // Skip rooms with nothing to do.
    store.run.steps += 1;
    path = getPath(store.run.steps, store.run.turns);
    room = path[path.length - 1];
  }
  store.run.room = room;
  store.run.enemy = room.type === 'combat' ? allEnemies.find((e) => e.name === room.name) : undefined;
}
