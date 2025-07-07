import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';

class Game {
  clicks: number;
  constructor(private page: Page) {
    this.clicks = 0;
  }
  async setup() {
    this.page.setDefaultTimeout(1_000);
    await this.page.goto('/');
    await this.page.addStyleTag({ path: 'tests/test-overrides.css' });
    this.page.on('dialog', async (dialog) => { await dialog.accept() });
    await expect(this.page).toHaveTitle(/Bands & Bonds/);
  }
  button(name: string) {
    return this.page.getByRole('button', { name });
  }
  async clickButton(name: string) {
    await test.step(`Click ${name}`, async () => {
      await this.button(name).click();
    });
    this.clicks++;
  }
  async defeatEnemy(name: string) {
    // Clicks attack buttons until the enemy is defeated.
    await test.step(`Defeat ${name}`, async () => {
      await expect(this.page.getByRole('heading', { name })).toBeVisible();
      const attacks = await this.page.locator('.actions > .slow').elementHandles();
      const clicksBefore = this.clicks;
      while (true) {
        if (await this.page.getByText('Defeated').isVisible()) {
          console.log(`Defeated ${name} after ${this.clicks - clicksBefore} clicks.`);
          return;
        }
        for (const e of attacks) {
          const r = await e.evaluate(e => {
            if (e instanceof HTMLButtonElement && !e.classList.contains('disabled')) {
              e.click();
              return 1;
            }
            if (e instanceof HTMLElement && e.innerHTML === 'Navigation') return -1;
            return 0;
          }, { timeout: 0 }).catch(() => -1);
          if (r === -1) break;
          this.clicks += r;
        }
      }
    });
  }
  async expectHeading(name: string) {
    await expect(this.page.getByRole('heading', { name })).not.toBeEmpty();
  }
  async tab(name: string) {
    await this.clickButton(name);
  }
  band(name: string) {
    return {
      grid: this.page.locator('.band-grid').getByRole('button', { name }),
      details: this.page.locator('.band-details').getByRole('heading', { name }),
      unlocked: this.page.locator('.band-unlocked').getByRole('button', { name }),
    };
  }
  async removeFromBand(name: string) {
    await test.step(`Remove ${name} from band`, async () => {
      const b = this.band(name);
      await expect(b.grid).toBeVisible();
      if (!await b.details.isVisible()) {
        await b.grid.click();
        await expect(b.details).toBeVisible();
      }
      await b.grid.click();
      await expect(b.unlocked).toBeVisible();
    });
  }
  async addToBand(name: string) {
    await test.step(`Add ${name} to band`, async () => {
      const b = this.band(name);
      await b.unlocked.click();
      await expect(b.details).toBeVisible();
      await this.page.locator('.band-grid').getByRole('button', { name: '+' }).first().click();
      await expect(b.grid).toBeVisible();
    });
  }
  async buyPacks() {
    await test.step('Buy packs', async () => {
      const button = this.page.getByRole('button', { name: 'Buy 1 for' });
      await expect(button).not.toContainClass('unaffordable');
      let bought = 0;
      while (true) {
        await button.click();
        bought++;
        if (await button.evaluate((el) => el.classList.contains('unaffordable'))) {
          console.log(`Bought ${bought} packs.`);
          return;
        }
      }
    });
  }
  async retreat() {
    await test.step(`Retreat after ${this.clicks} clicks`, async () => {
      const retreat = this.button('Retreat');
      await expect(retreat).toBeVisible();
      const text = await retreat.textContent();
      const m = text?.match(/keep the (\d+)/);
      if (m) {
        console.log(`Retreated after ${this.clicks} clicks with ${m[1]} fruit.`);
      } else {
        console.log(`Retreated after ${this.clicks} clicks with no fruit.`);
      }
      await retreat.click();
      await expect(this.button('Enter the Dungeon')).toBeVisible();
    });
    this.clicks = 0;
  }
  async rescue(name: string) {
    console.log(`Rescued ${name}.`);
    await test.step(`Rescue ${name}`, async () => {
      await this.clickButton('Rescue prisoner');
      await this.expectHeading(name);
    });
  }
  async manageBand(commands) {
    await test.step("Change band", async () => {
      await this.tab('Band');
      await this.buyPacks();
      await commands();
      const band = await this.page.locator('.band-grid').getByRole('button').evaluateAll(elements =>
        elements.map(el => el.getAttribute('aria-label'))
      );
      const summary = await this.page.getByText(/a total cost of \d+\s*, leaving you with \d+/).textContent();
      const m = summary?.match(/a total cost of (\d+)\s*, leaving you with (\d+)/);
      if (!m) throw new Error("Couldn't find band summary.");
      const used = Number.parseInt(m[1]);
      const remaining = Number.parseInt(m[2]);
      console.log(`${used}/${used + remaining} Band: ${band}`);
      await this.tab('Fight');
    });
  }
  async saveState(filename: string) {
    const localStorageData = await this.page.evaluate(() => {
      return Object.fromEntries(Object.entries(localStorage));
    });
    fs.writeFileSync(filename, JSON.stringify(localStorageData, null, 2));
  }
  async loadState(filename: string) {
    const localStorageData = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    await this.page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value as string);
      }
    }, localStorageData);
    await this.page.reload();
  }
}
test('playthrough', async ({ page }) => {
  const game = new Game(page);
  await game.setup();

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.rescue('Lamplighter');
  await game.clickButton('Turn right');
  await game.defeatEnemy('Poison Crow');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Animated Skeleton');
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Stick Master');
    await game.addToBand('Lamplighter');
    await game.addToBand('Stick Master');
  });

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Turn left');
  await game.defeatEnemy('Bandlings');
  await game.clickButton('Keep going');
  await game.rescue('The Silent Song');
  await game.retreat();
  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.retreat();
  await game.manageBand(async () => {
    await game.addToBand('The Silent Song');
  });

  await game.clickButton('Enter the Dungeon');
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
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Friend of Metal');
  });

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Turn right');
  await game.defeatEnemy('Poison Crow');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Animated Skeleton');
  await game.retreat();
  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Turn right');
  await game.defeatEnemy('Poison Crow');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Animated Skeleton');
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Lamplighter');
    await game.addToBand('Friend of Metal');
    await game.addToBand('The Silent Song');
  });

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Go straight');
  await game.defeatEnemy('Dead Gladiator');
  await game.clickButton('Turn left');
  await game.rescue('Dark Chef');
  await game.retreat();

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Go straight');
  await game.defeatEnemy('Dead Gladiator');
  await game.clickButton('Turn right');
  await game.defeatEnemy('Frozen Centurion');
  await game.clickButton('Keep going');
  await game.rescue('Anvilomancer');
  await game.retreat();
  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Dark Chef');
  });

  await game.clickButton('Enter the Dungeon');
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
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Dark Chef');
    await game.addToBand('Friend of Metal');
  });

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Go straight');
  await game.defeatEnemy('Dead Gladiator');
  await game.clickButton('Turn left');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Lobster Daddy');
  await game.clickButton('Keep going');
  await game.rescue('Royal Fruitbearer');
  await game.retreat();
  await game.manageBand(async () => {
    await game.addToBand('Royal Fruitbearer');
  });

  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy('Wild Slime');
  await game.clickButton('Keep going');
  await game.clickButton('Go straight');
  await game.defeatEnemy('Dead Gladiator');
  await game.clickButton('Turn left');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Lobster Daddy');
  await game.clickButton('Keep going');
  await game.retreat();
  await game.manageBand(async () => {
    await game.removeFromBand('Anvilomancer');
    // Place next to The Silent Song.
    await game.addToBand('Dark Chef');
    await game.addToBand('Anvilomancer');
  });

  await game.clickButton('Enter the Dungeon');
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
  await game.retreat();

  await game.clickButton('Enter the Dungeon');
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
  await game.clickButton('Go straight');
  await game.defeatEnemy('The Shroud');
  await game.clickButton('Keep going');
  await game.defeatEnemy('Dark Lord');
  await game.clickButton('Keep going');
  await game.rescue('Lord of Gears');
  await game.clickButton('Keep going');
  await game.retreat();
  await game.manageBand(async () => {
    await game.addToBand('Kin of Pump');
  });
  await game.saveState('last state.json');
});
test('next steps', async ({ page }) => {
  const game = new Game(page);
  await game.setup();
  await game.loadState('last state.json');

  await game.clickButton('Enter the Dungeon');
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
  await game.retreat();
  await game.manageBand(async () => {
    await game.addToBand('Coldblade');
  });

  // await game.defeatEnemy('Clockomancer');
  // await page.pause();
});
