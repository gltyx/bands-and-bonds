import { reactive } from 'vue'

export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
  [x: string]: unknown;
};

const enemies = {
  'Animated Skeleton': {
    name: 'Animated Skeleton',
    health: 100,
  },
};

export const store = reactive({
  damage: 0,
  enemy: enemies['Animated Skeleton'],
  timers: {} as Record<string, Timer>,
})
