import { test, expect, type Page } from '@playwright/test';

class Game {
  clicks: number;
  constructor(private page: Page) {
    this.clicks = 0;
  }

  async clickButton(name: string, times = 1) {
    for (let i = 0; i < times; i++) {
      await this.page.getByRole('button', { name }).click();
    }
  }
  async defeatEnemy() {
    // Clicks attack buttons until the enemy is defeated.
    await test.step("Defeat enemy", async () => {
      const enemyName = await this.page.getByRole('heading').innerText();
      const attacks = await this.page.locator('.actions > .slow').elementHandles();
      const clicksBefore = this.clicks;
      while (true) {
        if (await this.page.getByText('Defeated!').isVisible()) {
          console.log(`Defeated ${enemyName} after ${this.clicks - clicksBefore} clicks.`);
          return;
        }
        for (const e of attacks) {
          const r = await e.evaluate(e => {
            if (e instanceof HTMLButtonElement && !e.disabled) {
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
  async removeFromBand(name: string) {
    await this.clickButton(name);
    await this.clickButton(name);
    await expect(this.page.locator('.band-unlocked').getByRole('button', { name })).toBeVisible();
  }
  async addToBand(name: string) {
    await this.clickButton(name);
    await this.clickButton('+');
    await expect(this.page.locator('.band-grid').getByRole('button', { name })).toBeVisible();
  }
  async buyPack() {
    await this.page.getByRole('button', { name: 'Buy 1 for' }).click();
  }
  async retreat() {
    console.log(`Retreated after ${this.clicks} clicks.`);
    await this.clickButton('Retreat');
  }
  async rescue(name: string) {
    console.log(`Rescued ${name}.`);
    await this.clickButton('Rescue prisoner');
    await this.expectHeading(name);
  }
}
test('can be played through', async ({ page }) => {
  page.setDefaultTimeout(1_000);
  await page.goto('/');
  await page.addStyleTag({ path: 'tests/test-overrides.css' });
  page.on('dialog', async (dialog) => { await dialog.accept() });
  await expect(page).toHaveTitle(/Bands & Bonds/);
  const game = new Game(page);
  await game.clickButton('Enter the Dungeon');
  await game.expectHeading('Wild Slime');
  await game.defeatEnemy();
  await game.clickButton('Keep going');
  await game.rescue('Friend of Metal');
  await game.retreat();
  await game.tab('Band');
  await game.buyPack();
  await game.removeFromBand('Stick Master');
  await game.addToBand('Friend of Metal');
  await game.tab('Fight');
  await game.clickButton('Enter the Dungeon');
  await game.defeatEnemy();
  await game.clickButton('Keep going');
  await game.clickButton('Turn right');
  await game.defeatEnemy();
  await game.clickButton('Keep going');
});
