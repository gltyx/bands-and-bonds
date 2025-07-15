import { test } from '@playwright/test';
import Game from './game';

test('playthrough', async ({ page }) => {
  const game = new Game(page);
  await game.setup();

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.rescue('Lamplighter');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Stick Master');
    await game.addToBand('Lamplighter');
    await game.addToBand('Stick Master');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Bandlings');
    await game.clickButton('Keep going');
    await game.rescue('The Silent Song');
  });
  await game.manageBand(async () => {
    await game.addToBand('The Silent Song');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Thick Door');
    await game.clickButton('Keep going');
    await game.rescue('Friend of Metal');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Friend of Metal');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Lamplighter');
    await game.addToBand('Friend of Metal');
    await game.addToBand('The Silent Song');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.rescue('Dark Chef');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.rescue('Anvilomancer');
  });
  await game.manageBand(async () => {
    await game.addToBand('Dark Chef');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Trollish Maiden');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dryfin Carp');
    await game.clickButton('Keep going');
    await game.rescue('Kin of Pump');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Dark Chef');
    await game.addToBand('Anvilomancer');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.rescue('Royal Fruitbearer');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Go straight');
    await game.defeatEnemy('The Shroud');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dark Lord');
    await game.clickButton('Keep going');
    await game.rescue('Lord of Gears');
    await game.clickButton('Keep going');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Anvilomancer');
    await game.removeFromBand('The Silent Song');
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Stick Master');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('The Silent Song');
  });

  const shortWithGears = async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Animated Skeleton');
  }
  await game.run(8, shortWithGears);

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Silent Song');
    await game.addToBand('Dark Chef');
    await game.addToBand('Friend of Metal');
  });
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Trollish Maiden');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dryfin Carp');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Scaffold Sorcery');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lost Swimmer');
    await game.clickButton('Keep going');
    await game.rescue('Coldblade');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Xaranthian Construct');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.rescue('Pecquer');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Pecquer');
  });
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.clickButton('Sneak Past');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.defeatEnemy('Fortified Door');
    await game.clickButton('Keep going');
    await game.rescue('Knight of Claws');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Knight of Claws', 1);
    await game.addToBand('Dark Chef', 1);
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.rescue('Wayfinder');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.rescue('Desert Rabbit');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('The Silent Song');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Stick Master');
  });

  await game.run(5, async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Frozen Centurion');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('The Silent Song');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Kin of Pump');
  });


  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.rescue('Bayla');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Artifact Seeker")
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Dark Chef');
    await game.addToBand('Pecquer');
    await game.addToBand('Knight of Claws', 2);
  });

  async function goLeft() {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Xaranthian Construct');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
  }
  await game.run(async () => {
    await goLeft();
    await game.clickButton('Open door');
    await game.defeatEnemy('Fortified Door');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.clickButton('Sneak Past');
    await game.rescue('Kit Flash');
  });

  await game.run(async () => {
    await goLeft();
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.clickButton('Sneak Past');
    await game.rescue('Mongreler');
  });

  await game.run(async () => {
    await goLeft();
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Sneak Past');
    await game.rescue('Azrekta');
  });

  console.log(`Total clicks: ${game.totalClicks}`);
  await game.saveState('last state.json');
});
test('next steps', async ({ page }) => {
  const game = new Game(page);
  await game.setup();
  await game.loadState('last state.json');

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Kit Flash');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Knight of Claws', 2);
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Artifact Seeker")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Golden Chest")
    await game.clickButton('Keep going');
    await game.defeatEnemy("King of Tadpoles")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Hopanoids");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Tosyl Rose")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Sullen Bearer")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Unwelcoming Glade")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Food Mimic")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Frog Assassin")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Enantiomers");
    await game.clickButton('Keep going');
    await game.rescue('Smiling Pilot');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Gnollish Ambassador");
    await game.clickButton('Keep going');
    await game.rescue('Hedge Lost');
  });

  await game.manageBand(async () => {
    await game.addToBand('Hedge Lost', 2);
  });
  return;

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Azrekta');
    await game.addToBand('The Silent Song', 2);
  });
  await game.run(3, async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Lamperlighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Azrekta');
    await game.addToBand('The Silent Song');
  });
  return;

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Artifact Seeker")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Golden Chest")
    await game.clickButton('Keep going');
    await game.defeatEnemy("King of Tadpoles")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Hopanoids");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Tosyl Rose")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Sullen Bearer")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Unwelcoming Glade")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Food Mimic")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Frog Assassin")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Enantiomers");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Gnollish Ambassador");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Web of Power")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Tombstone of the Forgotten");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Hippogryph")
    await game.clickButton('Keep going');
    await game.defeatEnemy("The King's Armor");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Corridor of Illusions");
    await game.clickButton('Keep going');
    await game.rescue('Zaktar Kadoque');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Hiber Conduit");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Core Diver")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Smother Mother");
    await game.clickButton('Keep going');
    await game.defeatEnemy("The Final Warden");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Skelemasterion");
  });
});
