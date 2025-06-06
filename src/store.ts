import { reactive } from 'vue'

export type Timer = {
  time?: number;
  duration: number;
  cb?: (timer: Timer) => void;
  [x: string]: unknown;
};

export const store = reactive({
  damage: 0,
  timers: {} as Record<string, Timer>,
})
