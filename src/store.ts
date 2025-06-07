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

export const store = reactive({
  damage: 0,
  enemy: 0,
  timers: {} as Record<string, Timer>,
  band: { width: 5, height: 5 } as Band,
})

store.band[7] = 'Knight of Claws';
store.band[12] = 'Lamplighter';
store.band[13] = 'Stick Master';
