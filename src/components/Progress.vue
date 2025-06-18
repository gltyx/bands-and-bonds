<script setup lang="ts">
import { numberFormat } from '../store.ts'

defineProps<{
  value: number
  max: number
  color?: string
  label?: string
}>()
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: `${(value / max) * 100}%`, backgroundColor: color }"></div>
    <div class="progress-text numbers">
      {{ numberFormat.format(value) }} / {{ numberFormat.format(max) }} {{ label }}
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  position: relative;
  width: 200px;
  height: 30px;
  background-color: #333;
  border-radius: 4px;
  border: 1px solid #000;
  overflow: hidden;
  margin-top: 8px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-right: 1px solid #000;
  transition: width 0.1s;
}

.progress-text {
  position: absolute;
  padding: 0 8px;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 20px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
