import { reactive } from 'vue'

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
type Ability = {
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

export const enemies = [
  { name: 'Wild Slime', health: 30 },
  { name: 'Poison Crow', health: 50 },
  { name: 'Animated Skeleton', health: 100 },
  { name: 'The Shroud', health: 1000 },
  { name: 'Dark Lord', health: 10000 },
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
  'Desert Rabbit': {},
  'Friend of Metal and Fire': {},
  'Friend of Metal': {},
  'Knight of Claws': {},
  'Lamplighter': {
    description: "Lights up the 8 tiles around it, letting you extend your band.",
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

export function runData() {
  // Everything specific to the current run. Deleted when the run ends.
  return {
    weaponLevel: 1,
    speedLevel: 1,
    damage: 0,
    enemy: 0,
    metal: 0,
    poison: 0,
    timers: {} as Record<string, Timer>,
  };
}

export const store = reactive({
  run: runData(),
  band: { width: 5, height: 5, light: { 12: 1 } } as Band,
  unlocked: [] as string[],
  unassigned: [] as string[],

})

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
  store.run.damage += x;
  const enemy = enemies[store.run.enemy];
  if (store.run.damage >= enemy.health) {
    store.run.damage = 0;
    store.run.poison = 0;
    store.run.enemy += 1;
  }
}

for (const name in friends) {
  store.unlocked.push(name);
  store.unassigned.push(name);
}
