import type { Enemy } from './base';

export const allEnemies: Enemy[] = [
  {
    name: 'Wild Slime', health: 30, rewards: { gold: 1, fruit: 1 }, abilities: [
      {
        name: 'Slobber',
        duration: 5,
        damage: 1,
        description: 'Cover the enemy in slime.',
      },
    ], weaknesses: ['fire', 'ice', 'left', 'right'],
  },
  { name: 'Poison Crow', health: 50, rewards: { gold: 1, fruit: 1 } },
  {
    name: 'Animated Skeleton', health: 100, immune: ['poison'], rewards: { gold: 1, fruit: 1 }, abilities: [
      {
        name: 'Femurs Clashing',
        duration: 5,
        damage: 3,
        description: 'Bones to bones. Ashes to ashes.',
      },
    ],
    weaknesses: ['front', 'blunt'],
  },
  { name: 'Jaw Maw Maw', health: 100, rewards: { gold: 1, fruit: 1 } },
  { name: 'Bandlings', health: 100, rewards: { gold: 1, fruit: 1 }, count: 5 },
  { name: 'Will-o-Wasp', health: 100, rewards: { gold: 1, fruit: 1 }, dodge: 1 },
  { name: 'Clockomancer', health: 100, immune: ['speed'], rewards: { gold: 1, fruit: 1 } },
  { name: 'Lobster Daddy', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Trollish Maiden', health: 100, regen: 10, rewards: { gold: 1, fruit: 1 } },
  { name: 'Thick Door', health: 100, rewards: { gold: 1, fruit: 1 } },
  { name: 'Fortified Door', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Master of Doors', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'The Shroud', health: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Dark Lord', health: 10000, armor: 100, rewards: { gold: 10, fruit: 10 }, passiveEffects: ['Dark Lord has cursed you.'] },
  { name: 'Glass Dragon', health: 100000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Xaranthian Construct', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Frog Assassin', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Frozen Centurion', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Striped Horror', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Zakatrixos', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'King of Tadpoles', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Dead Gladiator', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Skelemasterion', health: 1000000, rewards: { gold: 1000, fruit: 1000 } },
];

export const enemiesByName = {} as Record<string, Enemy>;
for (const e of allEnemies) {
  enemiesByName[e.name] = e;
  for (const ab of e.abilities ?? []) {
    ab.image = e.name;
  }
}
