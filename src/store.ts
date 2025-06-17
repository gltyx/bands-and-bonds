import { reactive, watch } from 'vue';
import { allRooms, getPath } from './rooms.ts';
import { marked } from 'marked';

export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
  [x: string]: unknown;
};

export type Band = {
  width: number;
  height: number;
  [x: number]: string;
}
export type Ability = {
  name: string;
  description: string | (() => string);
  duration: number;
  damage?: number;
  consumes?: { [x: string]: number };
  onCompleted?: () => void;
  automatic?: boolean;
};

export type Friend = {
  name: string;
  cost: number;
  description?: string;
  abilities?: Ability[];
  super?: Partial<Friend>;
  descriptionHtml?: string | Promise<string>;
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

export const allFriends: Friend[] = [
  {
    name: 'Anvilomancer',
    cost: 6,
    description: `
An expert Anvilomancer can upgrade your weapons in the midst of battle.
Upgrades are mostly lost when leaving the dungeon. The weapon level is reset to
the square root of the highest level achieved.
    `,
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
    super: {
      name: 'Anvilominator',
      description: `
An expert Anvilominator can upgrade your weapons in the midst of battle.
Upgrades are never lost as long as you have the Anvilominator in your band.
    `,
    },
  },
  {
    name: 'Azrekta',
    cost: 120,
    description: `
Azrekta bedevils her friends and foes. Her friends become more powerful versions of themselves.
Her enemies get struck with a curse of that withers metals.
    `,
    abilities: [],
  },
  {
    name: 'Coldblade',
    cost: 31,
    description: "A frozen warrior. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
    abilities: [{
      name: "Glacial Strike",
      description: "A very cold blade with a very sharp edge.",
      duration: 3600 * 24 * 365 * 1000,
      damage: 1000000000,
    }],
  },
  {
    name: 'Dark Chef',
    cost: 37,
    description: "A master of the culinary arts, Dark Chef fights by poisoning the enemies.",
    abilities: [{
      name: "Poison Strike",
      duration: 5,
      description: "Damage over time.",
      onCompleted() {
        store.run.poison += Math.max(0, store.run.weaponLevel - (store.run.enemy?.armor ?? 0));
      },
    }],
    super: { name: 'Dark Sommelier' },
  },
  {
    name: 'Desert Rabbit',
    cost: 210,
    description: "The Desert Rabbit is a master of traversing hostile environments. Having him in your band makes it possible to change the band composition at campfires.",
  },
  {
    name: 'Friend of Metal',
    cost: 97,
    super: {
      name: 'Friend of Metal and Fire',
    },
  },
  {
    name: 'Knight of Claws',
    cost: 17,
  },
  {
    name: 'Lamplighter',
    cost: 12,
    description: "Lights up tiles around it, letting you expand your band.",
    abilities: [{
      name: "Illuminate",
      duration: 1,
      damage: 2,
      description: "Shines a light on the battlefield, damaging all enemies.",
    }],
    super: { name: 'Lamperlighter' },
  },
  {
    name: 'Royal Fruitbearer',
    cost: 64,
    description: "Whenever you find fruit in the dungeon, every member of the party gets one piece.",
    super: {
      name: 'Royal Fruitwearer',
      description: "Whenever you find fruit in the dungeon, every member of the party gives one piece to every other member.",
    },
  },
  {
    name: 'Stick Master',
    cost: 1,
    description: "Stick Master is a master of **the wooden stick**, using it to _whack enemies_ with precision and skill.",
    abilities: [{
      name: "Wooden Stick",
      duration: 0.5,
      damage: 1,
      description: "Whack it with a stick.",
    }],
    super: { name: 'Stick Grandmaster' },
  },
  {
    name: 'The Silent Song',
    cost: 87,
  },
  {
    name: 'Lord of Gears',
    cost: 29,
    description: `
The Lord of Gears is a master of automation. The band members next to him need not do anything.
Their abilities will be activated automatically.
    `,
    super: {
      name: 'Gear of Lords',
      description: `
The Gear of Lords is the ultimate master of automation. All abilities will be activated automatically.
    `,
    },
  },
  {
    name: 'Pur Lion',
    cost: 135,
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
  {
    name: 'Kit Flash',
    cost: 88,
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
  {
    name: 'Wayfinder',
    cost: 15,
    description: `
A master of navigation, Wayfinder will guide your band through a path without fail.
With Wayfinder in your band, you can replace members of your band at campfires.
    `,
    super: {
      name: 'Wayfindest',
      abilities: [{
        name: "Fall Back to Camp",
        duration: 20,
        description: 'Retreats to the last visited campfire.',
      }],
    }
  },
];
export const friendsByName = {} as Record<string, Friend>;
for (const f of allFriends) {
  f.descriptionHtml = marked(f.description ?? '');
  if (f.super?.description) {
    f.super.descriptionHtml = marked(f.super.description);
  }
  friendsByName[f.name] = f;
}

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
    12: 'Stick Master',
  };
}
function startingUnlocked(): string[] {
  return allFriends.map((f) => f.name);
}

export type Store = {
  run: ReturnType<typeof runData>;
  band: Band;
  fruit: number;
  unlocked: string[];
  discovered: string[];
};

const loadedStore = localStorage.getItem('store');
export const store = reactive<Store>(loadedStore ? JSON.parse(loadedStore) : {
  run: runData(),
  band: startingBand(),
  fruit: 999,
  unlocked: startingUnlocked(),
  discovered: [],
});
watch(store, (newValue) => {
  localStorage.setItem('store', JSON.stringify(newValue))
}, { deep: true });

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
  if (turn !== 'Enter the Dungeon' && !window.confirm(`${turn}?`)) return;
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
  if (!store.discovered.includes(`${room.x},${room.y}`)) {
    store.discovered.push(`${room.x},${room.y}`);
  }
  store.run.room = room;
  store.run.enemy = ['combat', 'boss', 'finalboss'].includes(room.type) ? allEnemies.find((e) => e.name === room.name) : undefined;
}
export function describeAbility(ab: Ability): string {
  let d = ab.description;
  if (typeof d === "function") {
    d = d();
  }
  if (ab.damage) {
    d += `\n\n${numberFormat.format(ab.damage * store.run.weaponLevel)} damage`;
  }
  return d;
}

export const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function friendAt(row: number, col: number): Friend | undefined {
  return friendsByName[store.band[col + row * store.band.width]];
}
export function nextTo(name: string, row: number, col: number): boolean {
  const az = (x: number, y: number) => friendAt(x, y)?.name === name;
  return az(row - 1, col) || az(row + 1, col) || az(row, col - 1) || az(row, col + 1);
}
export function onboard(name: string): boolean {
  return Object.values(store.band).some((n) => n === name || friendsByName[n]?.super?.name === name);
}
