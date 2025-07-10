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
    await game.retreat();
    await game.clickButton('Enter the Dungeon');
    await game.defeatEnemy('Wild Slime');
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

  await game.run(3, async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
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
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Anvilomancer');
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
    await game.addToBand('Friend of Metal');
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
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Lord of Gears');
  });

  const shortWithGears = async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Animated Skeleton');
  }
  await game.run(shortWithGears);
  await game.manageBand(async () => {
    await game.addToBand('Stick Master');
  });
  await game.run(3, shortWithGears);
  await game.manageBand(async () => {
    await game.addToBand('The Silent Song');
  });
  await game.run(5, shortWithGears);
  await game.saveState('last state.json');

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Anvilomancer');
    // Place next to The Silent Song.
    await game.addToBand('Dark Chef');
    await game.addToBand('Anvilomancer');
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

  await game.saveState('last state.json');
});
test('next steps', async ({ page }) => {
  const game = new Game(page);
  await game.setup();
  await game.loadState('last state.json');


});
