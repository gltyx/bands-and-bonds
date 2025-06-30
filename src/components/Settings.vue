<script setup lang="ts">
import { newTeam } from "../online.ts";
import { store } from "../store.ts";

function reset() {
  if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.") && window.confirm("Double checking: Are you sure you want to reset your progress? This cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
}

async function toggleOnline() {
  store.local.settings.online = !store.local.settings.online;
  if (store.local.settings.online) {
    if (!store.local.settings.teamId) {
      store.local.settings.teamId = await newTeam();
    }
  }
}

async function copyTeamLink() {
  const link = `${window.location.href}?join=${store.local.settings.teamId}`;
  console.log(link);
  await navigator.clipboard.writeText(link);
}
</script>

<template>
  <div class="actions">
    <button @click="toggleOnline()">
      <img :src="`images/generated/${store.local.settings.online ? 'on' : 'off'}line.webp`" />
      <div class="text">
        <div class="title">{{ store.local.settings.online ? 'Disable online features' : 'Enable online features' }}
        </div>
        <div class="description">
          When enabled, you can play Bands & Bonds with friends.
        </div>
        <p class="description">
          You share persistent progress, but everyone can go on dungeon runs independently.
        </p>
      </div>
    </button>
    <button @click="copyTeamLink()">
      <img src="/images/generated/copy-link.webp" />
      <div class="text">
        <div class="title">Copy invite link</div>
        <div class="description">
          Share this link with a friend to let them join your team.
        </div>
      </div>
    </button>
    <button @click="store.local.settings.blurImages = !store.local.settings.blurImages">
      <img src="/images/generated/blur-images.webp" />
      <div class="text">
        <div class="title">{{ store.local.settings.blurImages ? 'Unblur images' : 'Blur images' }}</div>
        <div class="description">
          All images in this prototype are AI generated. If you would rather not see them, turn on blurring.
        </div>
      </div>
    </button>
    <button @click="reset()">
      <img src="/images/generated/reset.webp" />
      <div class="text">
        <div class="title">Reset data</div>
        <div class="description">
          Throw away all your progress and start over.
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.actions {
  margin: 20px 0;
  columns: 310px auto;
  width: 100%;

  .section {
    display: block;
    color: #edb;
    break-after: avoid;
  }

  .section:before,
  .section:after {
    content: ' — ';
  }
}

.actions>* {
  display: flex;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
