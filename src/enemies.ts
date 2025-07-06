import type { Enemy } from './base';

export const allEnemies: Enemy[] = [
  {
    name: 'Wild Slime', health: 10, rewards: { gold: 1, fruit: 1 }, weaknesses: ['fire', 'ice', 'left', 'right'],
    abilities: [{ name: 'Slobber', duration: 5, damage: 1, description: 'Cover the enemy in slime.', }],
  },
  {
    name: 'Poison Crow', health: 20, rewards: { gold: 2, fruit: 0 }, weaknesses: ['fire', 'ice', 'left'],
    abilities: [{
      name: 'Crow Blast', duration: 5, description: 'An explosion of feathers and poison.',
      onCompleted(store) { store.addPoison(10); },
    }],
  },
  {
    name: 'Animated Skeleton', health: 50, rewards: { gold: 5, fruit: 5 }, weaknesses: ['front', 'blunt'],
    abilities: [{ name: 'Femurs Clashing', duration: 5, damage: 30, description: 'Bones to bones. Ashes to ashes.', }],
  },
  {
    name: 'Thick Door', health: 10, rewards: { gold: 0, fruit: 0 }, armor: 3, weaknesses: ['fire', 'blunt', 'back'],
    abilities: [{ name: 'Creaking', duration: 10, damage: 0, description: 'The door creaks ominously.', }],
  },
  { name: 'Bandlings', health: 5, rewards: { gold: 5, fruit: 2 }, count: 5 },
  { name: 'Dead Gladiator', health: 100, armor: 10, rewards: { gold: 10, fruit: 10 } },
  { name: 'Trollish Maiden', health: 1000, regen: 3, rewards: { gold: 8, fruit: 10 }, passiveEffects: ['The Trollish Maiden heals quickly.'] },
  { name: 'Lobster Daddy', health: 100, armor: 100, rewards: { gold: 10, fruit: 10 } },
  { name: 'Jaw Maw Maw', health: 100, rewards: { gold: 1, fruit: 1 } },
  { name: 'Will-o-Wasp', health: 100, rewards: { gold: 1, fruit: 1 }, dodge: 1 },
  { name: 'Clockomancer', health: 100000, immune: ['speed'], rewards: { fruit: 1000 } },
  { name: 'Fortified Door', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Master of Doors', health: 100, armor: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'The Shroud', health: 1000, ethereal: true, rewards: { gold: 1, fruit: 1 } },
  { name: 'Dark Lord', health: 10000, armor: 100, rewards: { gold: 10, fruit: 10 }, passiveEffects: ['The Dark Lord does not let you pass.'] },
  { name: 'Glass Dragon', health: 100000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Xaranthian Construct', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Skeletron', health: 100000, armor: 200, rewards: { gold: 1, fruit: 1 } },
  { name: 'Frog Assassin', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Frozen Centurion', health: 1000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Striped Horror', health: 1000000, rewards: { gold: 10, fruit: 10 } },
  { name: 'Zakatrixos', health: 1000000, ethereal: true, rewards: { gold: 1, fruit: 1 } },
  { name: 'King of Tadpoles', health: 1000000, rewards: { gold: 1, fruit: 1 } },
  { name: 'Geckalog', health: 100000, rewards: { gold: 100, fruit: 1 }, weaknesses: ['ice', 'left'] },
  { name: 'Dryfin Carp', health: 100000, rewards: { gold: 100, fruit: 10 }, weaknesses: ['water', 'back'] },
  { name: 'Artifact Seeker', health: 70000, rewards: { gold: 2000, fruit: 100 }, weaknesses: ['ice', 'fire', 'water'] },
  { name: 'Skyrmions', health: 100, ethereal: true, count: 107, rewards: { gold: 1, fruit: 1 }, weaknesses: ['back'] },
  { name: 'Tenebra', health: 30000, ethereal: true, count: 107, rewards: { gold: 1, fruit: 1 }, weaknesses: ['fire', 'front'] },
  { name: 'Landas Wizard', health: 100000, dodge: 1, rewards: { gold: 200, fruit: 100 }, weaknesses: ['water', 'back'] },
  { name: 'Defensive Installation', health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['blunt', 'front'] },
  { name: "Sullen Bearer", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['back'] },
  { name: "Lost Swimmer", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['ice'] },
  { name: "Potato Golem", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['blunt'] },
  { name: "Core Diver", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['water'] },
  { name: "Smother Mother", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['left', 'water'] },
  { name: "Corrupted Bounty Hunter", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['fast'] },
  { name: "Chago's Chamber", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['blunt', 'water'] },
  { name: "Chago", health: 1000, armor: 1000, rewards: { gold: 200 }, weaknesses: ['blunt', 'water'] },
  { name: 'Skelemasterion', health: 1000000, rewards: { gold: 1000, fruit: 1000 } },
];

export const enemiesByName = {} as Record<string, Enemy>;
for (const e of allEnemies) {
  enemiesByName[e.name] = e;
  for (const ab of e.abilities ?? []) {
    ab.image = e.name;
  }
}
