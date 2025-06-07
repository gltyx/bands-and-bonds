import { reactive } from 'vue'

export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
  [x: string]: unknown;
};

const enemies = [
  { name: 'Wild Slime', health: 30 },
  { name: 'Animated Skeleton', health: 100 },
];

export const store = reactive({
  damage: 0,
  enemy: enemies[0],
  timers: {} as Record<string, Timer>,
})
