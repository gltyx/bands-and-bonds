<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Combat from './components/Combat.vue'
import MapPage from './components/Map.vue'
import Band from './components/Band.vue'
import { store, damage, numberFormat } from './store.ts'

const animationFrameId = ref<number | null>(null);
const lastFrameTime = ref(performance.now());
const lastRegenTime = ref(performance.now());

type SelectedPage = 'combat' | 'map' | 'band';
const loadedPage = localStorage.getItem('current page') as SelectedPage;
const page = ref<SelectedPage>(loadedPage ?? 'combat');
watch(page, (newValue) => {
  localStorage.setItem('current page', newValue);
});

function mainLoop() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime.value;
  if (deltaTime > 100) { console.log('catching up:', deltaTime); }
  for (const [key, t] of Object.entries(store.run.timers)) {
    t.time ??= 0;
    t.time += Math.floor(deltaTime) * store.run.speedLevel;
    if (t.time >= t.duration) {
      t.cb?.(t);
      delete store.run.timers[key];
    }
  }
  const enemy = store.run.enemy;
  if (enemy && store.run.damage < enemy.health) {
    const regenPerSecond = (enemy.regen ?? 0) - store.run.poison;
    let regen = (currentTime - lastRegenTime.value) * regenPerSecond / 1000;
    while (regen > 1) {
      store.run.damage = Math.max(0, store.run.damage - 1);
      regen -= 1;
      lastRegenTime.value += 1000 / regenPerSecond;
    }
    while (regen < -1) {
      damage(1);
      if (store.run.poison === 0) {
        // The enemy died.
        regen = 0;
        break;
      }
      regen += 1;
      lastRegenTime.value -= 1000 / regenPerSecond;
    }
    if (regen === 0) lastRegenTime.value = currentTime;
  }
  lastFrameTime.value = currentTime;
  animationFrameId.value = requestAnimationFrame(mainLoop);
}

onMounted(() => {
  animationFrameId.value = requestAnimationFrame(mainLoop);
});

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>

<template>
  <div class="header">
    <div class="header-header">
      <div id="header-metal"><template v-if="store.run.metal">
          <img src="/images/generated/gold.webp" class="header-icon" />
          {{ numberFormat.format(store.run.metal) }}
        </template></div>
      <div class="logo title">
        <img src="/images/generated/logo.webp" alt="B" />ands
        <span style="color: #edb;">&nbsp;&&nbsp;</span>
        <img src="/images/generated/logo.webp" alt="B" />onds
      </div>
      <div id="header-fruit"><template v-if="store.fruit">
          {{ numberFormat.format(store.fruit) }}
          <img src="/images/generated/fruit.webp" class="header-icon" />
        </template></div>
    </div>
    <div class="tabs">
      <button :class="{ selected: page === 'combat' }" @click="page = 'combat'">Fight</button>
      <button :class="{ selected: page === 'map' }" @click="page = 'map'">Map</button>
      <button :class="{ selected: page === 'band' }" @click="page = 'band'">Band</button>
    </div>
  </div>
  <div class="page-container" v-show="page === 'combat'">
    <Combat />
  </div>
  <div class="page-container" v-show="page === 'map'">
    <MapPage />
  </div>
  <div class="page-container" v-show="page === 'band'">
    <Band />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  min-width: 512px;
  flex-direction: column;
  background-color: #000;
  padding: 10px;
  padding-bottom: 0;
  border-radius: 20px;
  width: 100%;

  .header-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: #edb;
    font-size: 20px;
  }

  .header-icon {
    width: 30px;
    height: 30px;
    vertical-align: top;
  }

  #header-metal {
    text-align: left;
  }

  #header-fruit {
    text-align: right;
  }

  #header-metal,
  #header-fruit {
    flex: 1 1 25%;
  }

  .logo {
    flex: 1 1 50%;
  }
}


@media (max-width: 800px) {
  .header {
    .header-header {
      flex-wrap: wrap;
    }

    #header-metal,
    #header-fruit {
      order: 2;
      flex: 1 1 50%;
    }

    .logo {
      order: 1;
      flex: 1 1 100%;
    }
  }
}

.tabs {
  display: flex;
  justify-content: space-around;

  button {
    display: inline-block;
    width: auto;
    background-color: transparent;
    border-radius: 0;
    padding: 5px 10px;
    font-size: 20px;
    border: none !important;
    outline: none !important;
    color: #bbb;
  }

  button:hover,
  button:focus,
  button.selected {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
  }

  button.selected {
    color: #edb;
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  font-size: 35px;
  position: relative;
  padding: 0 30px;
}

.logo img {
  width: 60px;
  height: 60px;
  margin-left: -10px;
  margin-right: -10px;
}

.logo span {
  z-index: 1;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}
</style>
