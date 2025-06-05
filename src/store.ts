import { reactive } from 'vue'

export type Attack = {
  duration: number;
  damage: number;
};

export const attacks: Record<string, Attack> = {
  'purple spark': { duration: 20, damage: 5 },
  'acid bolt': { duration: 5, damage: 10 },
};

export const store = reactive({
  damage: 0,
  attackTimers: {} as Record<string, number>,
})
