import { marked } from 'marked';
import { numberFormat, type Friend } from './base';


export const allFriends: Friend[] = [
  {
    name: 'Anvilomancer',
    cost: 6,
    description: `
An expert Anvilomancer can upgrade your weapons in the midst of battle.
Upgrades are mostly lost when leaving the dungeon. The weapon level is reset to
the square root of the highest level achieved.
    `,
    abilities: [{
      name: "Forge",
      duration: 5,
      consumes: { gold: 1 },
      description: (store) => `Increases the level of all weapons. (Currently ${store.run.weaponLevel}.)`,
      onCompleted: (store) => { store.run.weaponLevel += 1; },
    },
    {
      name: "Unforge",
      duration: 5,
      description: (store) => `Damages the armor of the enemy. (Currently ${store.run.room.armorDamage}.)`,
      onCompleted: (store) => { store.run.room.armorDamage = Math.min(store.currentEnemy?.armor ?? 0, store.run.room.armorDamage + 1); },
    }],
    super: {
      name: 'Anvilominator',
      description: `
An expert Anvilominator can upgrade your weapons in the midst of battle.
Upgrades are never lost as long as you have the Anvilominator in your band.
    `,
    },
  },
  {
    name: 'Azrekta',
    cost: 120,
    description: `
Azrekta bedevils her friends and foes. Her friends become more powerful versions of themselves.
Her enemies get struck with a curse of that withers metals.
    `,
    abilities: [],
  },
  {
    name: 'Coldblade',
    cost: 31,
    description: "A frozen warrior. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
    abilities: [{
      name: "Glacial Strike",
      description: "A very cold blade with a very sharp edge.",
      duration: 3600 * 24 * 365 * 1000,
      damage: 1000000000,
    }],
  },
  {
    name: 'Dark Chef',
    cost: 37,
    description: "A master of the culinary arts, Dark Chef fights by poisoning the enemies.",
    abilities: [{
      name: "Poison Strike",
      duration: 5,
      description: "Damage over time.",
      onCompleted(store) {
        store.run.room.poison += Math.max(0, store.run.weaponLevel - (store.currentEnemy?.armor ?? 0));
      },
    }],
    super: { name: 'Dark Sommelier' },
  },
  {
    name: 'Desert Rabbit',
    cost: 210,
    description: `
The Desert Rabbit is used to fighting gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Rabbit in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
    `,
  },
  {
    name: 'Friend of Metal',
    cost: 97,
    super: {
      name: 'Friend of Metal and Fire',
    },
  },
  {
    name: 'Knight of Claws',
    cost: 17,
  },
  {
    name: 'Lamplighter',
    cost: 12,
    description: "Lights up tiles around it, letting you expand your band.",
    abilities: [{
      name: "Illuminate",
      duration: 1,
      damage: 2,
      description: "Shines a light on the battlefield, damaging all enemies.",
    }],
    super: { name: 'Lamperlighter' },
  },
  {
    name: 'Royal Fruitbearer',
    cost: 64,
    description: "Whenever you find fruit in the dungeon, every member of the party gets one piece.",
    super: {
      name: 'Royal Fruitwearer',
      description: "Whenever you find fruit in the dungeon, every member of the party gives one piece to every other member.",
    },
  },
  {
    name: 'Stick Master',
    cost: 1,
    description: "Stick Master is a master of **the wooden stick**, using it to _whack enemies_ with precision and skill.",
    abilities: [{
      name: "Wooden Stick",
      duration: 0.5,
      damage: 10000,
      description: "Whack it with a stick.",
    }],
    super: { name: 'Stick Grandmaster' },
  },
  {
    name: 'The Silent Song',
    cost: 87,
  },
  {
    name: 'Lord of Gears',
    cost: 29,
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
    cost: 135,
    description: "A thief, wanted in all the thirty kingdoms. Yet nobody is able to give an accurate description of him. He has the ability to _snatch_ items from enemies in the fray of the battle.",
    abilities: [{
      name: "Snatch",
      duration: 0.5,
      description: "Steals a piece of gold.",
      onCompleted(store) {
        store.run.gold += 1;
      },
    }],
  },
  {
    name: 'Kit Flash',
    cost: 88,
    description: "A wizard of speed, Kit Flash can _run_ faster than the eye can see. He is able to speed up the abilities of every member of the band.",
    abilities: [{
      name: "Running Start",
      duration: 10,
      consumes: { gold: 1 },
      description: (store) => `Speed up all abilities. (Currently ${numberFormat(store.run.speedLevel)}×.)`,
      onCompleted(store) {
        store.run.speedLevel += 1;
      },
    }],
    super: {
      name: 'Kit Storming',
      abilities: [{
        name: "Running Start",
        duration: 10,
        consumes: { gold: 1 },
        description: (store) => `Speed up all abilities. (Currently ${numberFormat(store.run.speedLevel)}×.)`,
        onCompleted(store) {
          store.run.speedLevel *= 2;
        },
      }],
    },
  },
  {
    name: 'Wayfinder',
    cost: 15,
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
      }],
    }
  },
  {
    name: 'Bayla',
    cost: 15,
  },
  {
    name: 'Kin of Pump',
    cost: 15,
  },
  {
    name: 'Kevin',
    cost: 220,
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
    description: "A collector of unusual pets. Mongreler can capture weakened enemies and deploy them on the battlefield.",
    abilities: [{
      name: "Capture",
      duration: 5,
      description: "Captures a weakened enemy. The enemy will fight along your side for the rest of the run.",
    }],
    super: {
      name: 'Monster Juggler',
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
    name: 'Pequer',
    cost: 50,
    description: "",
    super: {
      name: 'Le Pequer',
    },
  },
  {
    name: 'Hedge Lost',
    cost: 11,
    description: "",
    super: {
      name: 'Hedge Found',
    },
  },
  {
    name: 'Zaktar Kadoque',
    cost: 20,
    description: "",
  },
];
export const friendsByName = {} as Record<string, Friend>;
for (const f of allFriends) {
  f.descriptionHtml = marked(f.description ?? '');
  if (f.super?.description) {
    f.super.descriptionHtml = marked(f.super.description);
  }
  friendsByName[f.name] = f;
}
