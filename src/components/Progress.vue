<script setup lang="ts">
defineProps<{
  value: number
  max: number
}>()
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: `${(value / max) * 100}%` }"></div>
    <div class="progress-text">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  position: relative;
  width: 200px;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
}

.progress-text {
  position: absolute;
  font-family: monospace;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 0.875rem;
}
</style>
