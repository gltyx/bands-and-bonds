import type { Enemy } from './base';

export const allEnemies: Enemy[] = [
  {
    name: 'Wild Slime', health: 20, rewards: { gold: 1, fruit: 1 }, weaknesses: ['fire', 'ice', 'left', 'right'],
    abilities: [{ name: 'Slobber', duration: 5, damage: 1, description: 'Cover the enemy in slime.', }],
  },
  {
    name: 'Poison Crow', health: 50, rewards: { gold: 2, fruit: 0 }, weaknesses: ['fire', 'ice', 'left'],
    abilities: [{
      name: 'Crow Blast', duration: 5, description: 'An explosion of feathers and poison.',
      onCompleted(store) { store.addPoison(1); },
    }],
  },
  {
    name: 'Animated Skeleton', health: 100, immune: ['poison'], rewards: { gold: 5, fruit: 5 }, weaknesses: ['front', 'blunt'],
    abilities: [{ name: 'Femurs Clashing', duration: 5, damage: 3, description: 'Bones to bones. Ashes to ashes.', }],
  },
  {
    name: 'Thick Door', health: 100, rewards: { gold: 0, fruit: 0 }, armor: 5, weaknesses: ['fire', 'blunt', 'back'],
    abilities: [{ name: 'Creaking', duration: 10, damage: 0, description: 'The door creaks ominously.', }],
  },
  { name: 'Bandlings', health: 20, rewards: { gold: 5, fruit: 2 }, count: 5 },
  { name: 'Trollish Maiden', health: 1000, regen: 3, rewards: { gold: 8, fruit: 10 }, passiveEffects: ['The Trollish Maiden heals quickly.'] },
  { name: 'Lobster Daddy', health: 100, armor: 100, rewards: { gold: 10, fruit: 10 } },
  { name: 'Jaw Maw Maw', health: 100, rewards: { gold: 1, fruit: 1 } },
  { name: 'Will-o-Wasp', health: 100, rewards: { gold: 1, fruit: 1 }, dodge: 1 },
  { name: 'Clockomancer', health: 100, immune: ['speed'], rewards: { gold: 1, fruit: 1 } },
  { name: 'Fortified Door', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Master of Doors', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'The Shroud', health: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Dark Lord', health: 10000, armor: 100, rewards: { gold: 10, fruit: 10 }, passiveEffects: ['The Dark Lord does not let you pass.'] },
  { name: 'Glass Dragon', health: 100000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Xaranthian Construct', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Skeletron', health: 100000, armor: 200, rewards: { gold: 1, fruit: 1 } },
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
