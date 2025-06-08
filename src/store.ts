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
  [x: number]: string;
}

export const enemies = [
  { name: 'Wild Slime', health: 30 },
  { name: 'Poison Crow', health: 50 },
  { name: 'Animated Skeleton', health: 100 },
];

export const friends = {
  'Anvilomancer': { description: "Anvilomancer is a master of metal and fire, forging powerful weapons and armor." },
  'Azrekta': { description: "Azrekta is a fierce warrior with a cold blade, known for her swift and deadly strikes.\n\nAbilities:\n- Magic.\n- Cuteness." },
  'Coldblade': {},
  'Dark Chef': {},
  'Desert Rabbit': {},
  'Friend of Metal and Fire': {},
  'Friend of Metal': {},
  'Knight of Claws': {},
  'Lamplighter': {},
  'Royal Fruitbearer': {},
  'Stick Grandmaster': {},
  'Stick Master': {},
  'The Silent Song': {},
};

export const store = reactive({
  damage: 0,
  enemy: 0,
  timers: {} as Record<string, Timer>,
  band: { width: 5, height: 5 } as Band,
  unlocked: [] as string[],
  unassigned: [] as string[],
})

for (const name of Object.keys(friends)) {
  store.unlocked.push(name);
}

store.band[2] = 'Royal Fruitbearer';
store.band[6] = 'Desert Rabbit';
store.band[7] = 'Knight of Claws';
store.band[12] = 'Lamplighter';
store.band[13] = 'Stick Master';
store.band[8] = 'Dark Chef';
store.band[11] = 'Anvilomancer';
store.band[16] = 'Azrekta';
store.band[17] = 'The Silent Song';
store.band[18] = 'Stick Grandmaster';
store.band[21] = 'Friend of Metal';
store.band[22] = 'Friend of Metal and Fire';
store.band[23] = 'Coldblade';
