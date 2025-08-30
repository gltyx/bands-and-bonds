<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{
  show: boolean;
  skelemasterion?: boolean;
}>();
const emit = defineEmits(['on-start', 'on-end']);
function image(n: number) {
  return `images/generated/victory${props.skelemasterion ? "-skelemasterion" : ""}${n}.webp`;
}
</script><template>
  <Transition @before-enter="emit('on-start')" @after-leave="emit('on-end')">
    <div class="celebrating" :style="{ height: `${props.skelemasterion ? 300 : 200}px` }" v-if="props.show">
      <img class="layer1" :src="image(1)" alt="A circle of golden swords" />
      <img class="layer2" :src="image(2)" alt="A golden shield" />
      <img class="layer3" :src="image(3)" alt="A sword with red gems" />
      <img class="layer4" :src="image(4)" alt="A sword with blue gems" />
      <div class="victory-text-backdrop">
        Victory!
      </div>
      <div class="victory-text">
        Victory!
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.celebrating {
  position: relative;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  pointer-events: none;

  img {
    position: absolute;
    top: 0;
    left: 50%;
    max-height: 100%;
    width: auto;
  }

  .layer1 {
    transform: translateX(-50%) translateZ(-60px);
  }

  .layer2 {
    transform: translateX(-50%) scale(0.8) translateZ(-40px);
  }

  .layer3 {
    transform: translateX(-50%) rotateZ(45deg) translateZ(-20px) scale(0.9, 1);
  }

  .layer4 {
    transform: translateX(-50%) rotateZ(-45deg) translateZ(-10px) scale(0.9, 1);
  }

  .victory-text-backdrop,
  .victory-text {
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    font-family: 'Grenze Gotisch', serif;
    font-size: 30px;
    color: #edb;
    user-select: none;
  }

  .victory-text-backdrop {
    color: black;
    -webkit-text-stroke: 5px #000;
    transform: translateX(-50%) translateY(-50%) translateZ(-3px);
  }
}

.v-enter-active.celebrating {
  transition: transform 1s ease-out;
}

.v-leave-active.celebrating {
  transition: transform 1s ease-in;
}

.v-enter-from.celebrating {
  transform: rotateX(90deg) translateZ(90px);
}

.v-enter-to.celebrating,
.v-leave-from.celebrating {
  transform: rotateX(0deg) translateZ(90px);
}

.v-leave-to.celebrating {
  transform: rotateX(-90deg) translateZ(90px);
}
</style>
