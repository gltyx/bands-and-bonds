import { marked } from 'marked';
import { numberFormat, type Friend } from './base';

function numberSpan(n: number, extra?: string): string {
  const e = extra ?? '';
  return `<span class="numbers">${numberFormat(n)}${e}</span>`;
}

export const allFriends: Friend[] = [
  {
    name: 'Anvilomancer',
    finished: true,
    cost: 6,
    description: `
An expert Anvilomancer can upgrade your weapons in the midst of battle.
Upgrades are mostly lost when leaving the dungeon.
The starting weapon level is the square root of the highest level achieved.
    `,
    abilities: [{
      name: "Forge",
      duration: 5,
      consumes: { gold: 1 },
      description: (store) => `Increases the level of all weapons. (Currently ${numberSpan(store.run.weaponLevel)}.)`,
      onCompleted(store) {
        store.run.weaponLevel += 1;
        if (store.run.weaponLevel > store.team.bestWeaponLevel) {
          store.team.bestWeaponLevel = store.run.weaponLevel;
        }
      },
    }],
    onAdded(store) {
      store.run.weaponLevel = Math.max(store.run.weaponLevel, Math.floor(Math.sqrt(store.team.bestWeaponLevel)));
    },
    onRemoved(store) {
      store.run.weaponLevel = 1;
    },
    super: {
      name: 'Anvilominator',
      description: `
An expert Anvilominator can upgrade your weapons in the midst of battle.
The Anvilominator retains upgrades from earlier runs.
The starting weapon level is the highest level achieved.
    `,
      abilities: [{
        name: "Forge",
        duration: 5,
        consumes: { gold: 1 },
        description: (store) => `Increases the level of all weapons. (Currently ${numberSpan(store.run.weaponLevel)}.)`,
        onCompleted(store) {
          store.run.weaponLevel += 1;
          if (store.run.weaponLevel > store.team.bestWeaponLevel) {
            store.team.bestWeaponLevel = store.run.weaponLevel;
          }
        },
      },
      {
        name: "Unforge",
        duration: 5,
        description: 'Damages the armor of the enemy.',
        onCompleted(store) {
          store.run.room.armorDamage = Math.min(store.currentEnemy()?.armor ?? 0, store.run.room.armorDamage + 1);
        },
      }],
      onAdded(store) {
        store.run.weaponLevel = store.team.bestWeaponLevel;
      },
      onRemoved(store) {
        store.run.weaponLevel = 1;
      },
    },
  },
  {
    name: 'Azrekta',
    cost: 25,
    finished: true,
    description: `
Azrekta bedevils her friends and foes. Her friends become more powerful versions of themselves.
Her enemies become ethereal, making them challenging to hit.
    `,
    abilities: [],
  },
  {
    name: 'Coldblade',
    cost: 31,
    finished: true,
    description: "A frozen warrior. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
    abilities: [{
      name: "Glacial Strike",
      description: "A very cold blade with a very sharp edge.",
      duration: 3600 * 24 * 365 * 1000,
      damage: 1000000000,
      tags: ['sharp', 'cold'],
    }],
    super: {
      name: 'Hotblade',
      description: "A frozen warrior, now with a hot blade. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
      abilities: [{
        name: "Glacial Flame Strike",
        description: "A very hot blade with a very sharp edge.",
        duration: 3600 * 24 * 365 * 1000,
        damage: 1000000000,
        tags: ['sharp', 'fire'],
      }],
    },
  },
  {
    name: 'Dark Chef',
    finished: true,
    cost: 4,
    description: `
A master of the culinary arts, Dark Chef fights by poisoning the enemies.
The only way to defend against his attacks is to wear layers of heavy armor.`,
    abilities: [{
      name: "Poison Strike",
      duration: 5,
      description: (store) => store.run.room.poison ? `Damage over time. (Currently ${numberSpan(store.run.room.poison)} damage per second.)` : 'Damage over time.',
      onCompleted(store) {
        store.addPoison(1);
      },
    }],
    super: {
      name: 'Dark Sommelier',
    },
  },
  {
    name: 'Desert Rabbit',
    finished: true,
    cost: 30,
    description: `
The Desert Rabbit is used to fighting gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Rabbit in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
    `,
    super: {
      name: 'Desert Armadillo',
      description: `
The Desert Armadillo is used to fighting gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Armadillo in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
The damage bonus can be further increased with the Blessing of the Desert ability.
    `,
      abilities: [{
        name: "Blessing of the Desert",
        duration: 5,
        consumes: { gold: 1 },
        description: (store) => `Increases the damage multiplier for weaknesses. (Currently ${numberSpan(store.run.desertBlessingMultiplier, '×')}.)`,
        onCompleted(store) {
          store.run.desertBlessingMultiplier += 1;
        },
      }],
    },
  },
  {
    name: 'Friend of Metal',
    description: 'A warrior equipped with high-quality metal armor and weapons.',
    finished: true,
    cost: 10,
    abilities: [{
      name: "Steel Jab",
      duration: 3,
      damage: 10,
      description: "A finely crafted sword in the hands of a Friend of Metal.",
      tags: ['sharp', 'steel'],
    }],
    super: {
      name: 'Friend of Metal and Fire',
      abilities: [{
        name: "Steel Jab+",
        duration: 3,
        damage: 100,
        description: "A finely crafted sword in the hands of a Friend of Metal and Fire.",
        tags: ['sharp', 'steel'],
      }, {
        name: "Flame Jab+",
        duration: 3,
        damage: 100,
        description: "A flaming sword in the hands of a Friend of Metal and Fire.",
        tags: ['sharp', 'fire'],
      }],
    },
  },
  {
    name: 'Knight of Claws',
    cost: 13,
    finished: true,
    description: `
Trained as an assassin, the Knight of Claws works best on his own. His power doubles for every empty space next to him.
    `,
    abilities: [{
      name: "Claws & Thorns",
      duration: 100,
      damage(store) {
        const pos = store.onboard('Knight of Claws');
        const empty = pos ? store.emptySpacesAround(pos.row, pos.col).length : 0;
        return 100 * 2 ** empty;
      },
      description: "A whirlwind of sharp blades ravages the battlefield.",
      onCompleted(store) {
        store.addDamage(store.currentEnemy()?.health ?? 0);
      },
    }],
  },
  {
    name: 'Lamplighter',
    cost: 6,
    finished: true,
    description: "Lights up tiles around it, letting you expand your band.",
    abilities: [{
      name: "Illuminate",
      duration: 1,
      damage: 2,
      description: "Shines a light on the battlefield, hurting the eyes accustomed to darkness.",
      tags: ['light'],
    }],
    super: { name: 'Lamperlighter' },
  },
  {
    name: 'Royal Fruitbearer',
    cost: 6,
    finished: true,
    description: `
With the Royal Fruitbearer in your band, whenever you find fruit in the dungeon, every member of the party gets one piece.
    `,
    passiveEffects: ["When you find fruit, every member of the party gets one piece. (Thanks to the Royal Fruitbearer.)"],
    super: {
      name: 'Royal Fruitwearer',
      description: `
With the Royal Fruitwearer in your band, whenever you find fruit in the dungeon,
every member of the party gives one piece to every other member.
      `,
      passiveEffects: ["When you find fruit, every member of the party gives one piece to every other member. (Thanks to the Royal Fruitwearer.)"],
    },
  },
  {
    name: 'Stick Master',
    cost: 1,
    finished: true,
    description: `
Stick Master is a humble explorer. While wandering the forest, they came upon the ruins of a long-lost castle.
At the lowest level, they discovered the entrance to the dungeon.
    `,
    abilities: [{
      name: "Wooden Stick",
      duration: 0.5,
      damage: 1,
      description: "Whack it with a stick.",
      tags: ['blunt'],
    }],
    super: {
      name: 'Stick Grandmaster',
      abilities: [{
        name: "Wooden Stick",
        duration: 0.5,
        damage: 2,
        description: "Whack it with a stick quite hard.",
        tags: ['blunt'],
      }],
    },
  },
  {
    name: 'The Silent Song',
    cost: 2,
    finished: true,
    description: "Her sweet melody doubles the damage dealt by friends standing next to her.",
    super: {
      name: 'The Silent Quartet',
      description: "Their sweet melody doubles the damage dealt by all friends.",
    },
  },
  {
    name: 'Lord of Gears',
    cost: 29,
    finished: true,
    description: `
The Lord of Gears is a master of automation. The band members next to him need not do anything.
Their abilities will be activated automatically.
    `,
    super: {
      name: 'Gear of Lords',
      description: `
The Gear of Lords is the ultimate master of automation. All abilities will be activated automatically.
    `,
    },
  },
  {
    name: 'Pur Lion',
    cost: 35,
    finished: true,
    description: "A thief, wanted in all the thirty kingdoms. Yet nobody is able to give an accurate description of him.",
    abilities: [{
      name: "Snatch",
      duration: 2.5,
      description: "Steals a piece of gold.",
      onCompleted(store) {
        store.run.gold += 1;
      },
    }],
    super: {
      abilities: [{
        name: "Snatch",
        duration: 2.5,
        description: "Steals a piece of gold. Affected by the weapon level.",
        onCompleted(store) {
          store.run.gold += store.run.weaponLevel;
        },
      }],
    },
  },
  {
    name: 'Kit Flash',
    cost: 8,
    finished: true,
    description: "A wizard of speed, Kit Flash can speed up the abilities of every member of the band.",
    abilities: [{
      name: "Running Start",
      duration: 10,
      consumes: { gold: 1 },
      description: (store) => `Speed up all abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
      onCompleted(store) {
        store.run.speedLevel += 1;
      },
    }],
    super: {
      name: 'Kit Storming',
      description: "A wizard of speed, Kit Storming can speed up the abilities of every member of the band.",
      abilities: [{
        name: "Running Start",
        duration: 10,
        consumes: (store) => ({ gold: store.run.speedLevel }),
        description: (store) => `Speed up all abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
        onCompleted(store) {
          store.run.speedLevel *= 2;
        },
      }],
    },
  },
  {
    name: 'Wayfinder',
    cost: 15,
    finished: true,
    description: `
A master of navigation, Wayfinder will guide your band through a path without fail.
With Wayfinder in your band, you can replace members of your band at campfires.
    `,
    super: {
      name: 'Wayfindest',
      abilities: [{
        name: "Fall Back to Camp",
        duration: 20,
        description: 'Retreats to the last visited campfire.',
        onCompleted(store) {
          const path = store.currentPath();
          let steps = store.run.steps;
          while (steps > 0 && path[steps].type !== 'rescue') {
            steps -= 1;
          }
          store.run.steps = steps;
        },
      }],
    }
  },
  {
    name: 'Bayla',
    cost: 15,
    finished: true,
    description: `
Bayla is an unpredictable fighter. She can change her position in the middle of a fight to best target the weak spots
of her enemies. She's great friends with the Desert Rabbit.
    `,
    abilities: [{
      name: "Battle Rhythm",
      duration: 1,
      damage: 100,
      tags: ['sharp', 'fire', 'ice'],
      description: "A flight of small magical blades timed perfectly to find the weak spots of the enemy.",
    }],
    super: {
      name: 'Baylanda',
      description: `
Baylanda is a master choreographer. She can rearrange the band in the middle of a fight to best target the weak spots
of her enemies. She's great friends with the Desert Rabbit and likes to stick close to Azrekta.
`,
    },
  },
  {
    name: 'Kin of Pump',
    cost: 15,
  },
  {
    name: 'Kevin',
    cost: 22,
    finished: true,
    description: `
Kevin is not so much a person as a phenomenon. When Kevin is present, all enemies are vulnerable to fire.
    `,
    // Super: "Kevout"?
  },
  {
    name: 'Smiling Pilot',
    cost: 50,
    super: {
      name: 'Smiling Admiral',
    },
  },
  {
    name: 'Mongreler',
    cost: 50,
    finished: true,
    description: "A collector of unusual pets. Mongreler can capture weakened enemies and deploy them on the battlefield.",
    passiveEffects: ['Mongreler wants to capture this enemy. Damage is reduced by 99% to avoid killing it.'],
    super: {
      name: 'Monster Juggler',
      passiveEffects: ['Monster Juggler wants to capture this enemy. Damage is reduced by 99% to avoid killing it.'],
    },
  },
  {
    name: 'Eighth Swimmer',
    cost: 50,
    description: "",
    super: {
      name: 'Seventh Swimmer',
    },
  },
  {
    name: 'Pecquer',
    cost: 50,
    description: "",
    super: {
      name: 'Le Pecquer',
    },
  },
  {
    name: 'Hedge Lost',
    cost: 11,
    finished: true,
    description: "",
    abilities: [{
      name: "Buy Fruit",
      duration: 5,
      consumes: { gold: 100 },
      description: 'Buy a piece of fruit at the Hedge Market.',
      onCompleted(store) {
        store.run.fruit += 1;
      },
    }],
    super: {
      name: 'Hedge Found',
      abilities: [{
        name: "Buy Fruit",
        duration: 5,
        consumes: { gold: 100 },
        description: 'Buy a piece of fruit at the Hedge Market.',
        onCompleted(store) {
          store.run.fruit += 1;
        },
      }, {
        name: "Buy Sapling",
        duration: 5,
        consumes: { gold: 100 },
        description: (store) => `
Buy a fruit sapling at the Hedge Market.${store.run.saplings ? `
(Currently ${numberSpan(store.run.saplings)} saplings producing
${numberSpan(store.run.saplings, ' <img src="/images/generated/fruit.webp" class="resource-icon" />')} per second.)` : ''}`,
        onCompleted(store) {
          store.run.saplings += 1;
        },
      }],
    },
  },
  {
    name: 'Zaktar Kadoque',
    cost: 20,
    description: "",
    super: {
      name: 'Zaktar Kadoque Karr',
    },
  },
  {
    name: 'Xaranthian Constructor',
    finished: true,
    cost: 20,
    description: `
The Xaranthian Empire is said to be ruled by wise engineers who built powerful machines to ease their work.
But building such machines is hard work too, so the Xarantians built factories to produce mechanical turtles
that can build machines that can deploy other machines that can grow further machines.

The Xaranthian factories in turn are built by Xaranthian Constructors. This one has never seen
a Xaranthian person, and neither has anyone else in your band.
    `,
    abilities: [{
      name: "Construct Grower",
      consumes: { gold: 10 },
      duration: 5,
      description: (store) =>
        `Construct a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
      onCompleted(store) {
        store.run.room.xaranthian.growers += 1;
      }
    }, {
      name: "Grow Gun",
      consumes: { gold: 10 },
      hidden: (store) => store.run.room.xaranthian.growers !== 1,
      duration: 5,
      description: (store) =>
        `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store) {
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
      },
    }, {
      name: "Grow Guns",
      consumes: { gold: 10 },
      hidden: (store) => store.run.room.xaranthian.growers < 2,
      duration: 5,
      description: (store) =>
        `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store) {
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
      }
    }, {
      name: "Fire Xaranthian Gun",
      hidden: (store) => store.run.room.xaranthian.guns !== 1,
      duration: 5,
      description: "Fire the mechanical gun.",
      damage: 1,
    }, {
      name: "Fire Xaranthian Guns",
      hidden: (store) => store.run.room.xaranthian.guns < 2,
      duration: 5,
      description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
      damage: (store) => store.run.room.xaranthian.guns,
    }],
    super: {
      name: 'Xaranthian Power Constructor',
      abilities: [{
        name: "Construct Factory",
        consumes: { gold: 10 },
        duration: 5,
        description: (store) =>
          `Build a factory for producing mechanical turtles.${store.run.room.xaranthian.factories ? ` (Currently ${numberSpan(store.run.room.xaranthian.factories)} factories.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.factories += 1;
        },
      }, {
        name: "Produce Turtle",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.factories !== 1,
        duration: 5,
        description: (store) =>
          `Build a mechanical turtle in the factory.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories;
        },
      }, {
        name: "Produce Turtles",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.factories < 2,
        duration: 5,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.factories)} mechanical turtles in the factories.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories;
        },
      }, {
        name: "Build Deployer",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.turtles !== 1,
        duration: 5,
        description: (store) =>
          `Build a deployer from the mechanical turtle.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles;
        }
      }, {
        name: "Build Deployers",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.turtles < 2,
        duration: 5,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.turtles)} deployers from the mechanical turtles.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles;
        }
      }, {
        name: "Deploy Grower",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.deployers !== 1,
        duration: 5,
        description: (store) =>
          `Deploy a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers;
        }
      }, {
        name: "Deploy Growers",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.deployers < 2,
        duration: 5,
        description: (store) =>
          `Deploy ${numberSpan(store.run.room.xaranthian.deployers)} mechanical growers.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers;
        }
      }, {
        name: "Grow Gun",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.growers !== 1,
        duration: 5,
        description: (store) =>
          `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
        },
      }, {
        name: "Grow Guns",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.growers < 2,
        duration: 5,
        description: (store) =>
          `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
        }
      }, {
        name: "Fire Xaranthian Gun",
        hidden: (store) => store.run.room.xaranthian.guns !== 1,
        duration: 5,
        description: "Fire the mechanical gun.",
        damage: 1,
      }, {
        name: "Fire Xaranthian Guns",
        hidden: (store) => store.run.room.xaranthian.guns < 2,
        duration: 5,
        description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
        damage: (store) => store.run.room.xaranthian.guns,
      }],
    },
  },
];
export const friendsByName = {} as Record<string, Friend>;
for (const f of allFriends) {
  friendsByName[f.name] = f;
  f.descriptionHtml = marked(f.description ?? '');
  if (f.super?.name) {
    friendsByName[f.super.name] = { ...f, ...f.super };
    if (f.super.description) {
      f.super.descriptionHtml = marked(f.super.description);
    }
  }
}
