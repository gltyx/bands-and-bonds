<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits(['on-start', 'on-end']);
</script><template>
  <Transition @before-enter="emit('on-start')" @after-leave="emit('on-end')">
    <div class="celebrating" v-if="props.show">
      <img class="layer1" src="/images/generated/victory1.webp" alt="A circle of golden swords" />
      <img class="layer2" src="/images/generated/victory2.webp" alt="A golden shield" />
      <img class="layer3" src="/images/generated/victory3.webp" alt="A sword with red gems" />
      <img class="layer4" src="/images/generated/victory4.webp" alt="A sword with blue gems" />
      <div class="victory-text">
        Victory!
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.celebrating {
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform: translateZ(70px);

  img {
    position: absolute;
    top: 0;
    left: 50%;
    width: 200px;
  }

  .layer1 {
    transform: translateX(-50%) translateZ(-60px);
  }

  .layer2 {
    transform: translateX(-50%) scale(0.8) translateZ(-40px);
  }

  .layer3 {
    transform: translateX(-50%) rotateZ(45deg) translateZ(-20px);
  }

  .layer4 {
    transform: translateX(-50%) rotateZ(-45deg) translateZ(-10px);
  }

  .victory-text {
    font-family: 'Grenze Gotisch', serif;
    font-size: 30px;
    color: #edb;
    -webkit-text-stroke: 5px #0008;
    paint-order: stroke fill;
  }
}

.v-enter-active.celebrating {
  transition: transform 1s ease-out;
}

.v-leave-active.celebrating {
  transition: transform 1s ease-in;
}

.v-enter-from.celebrating {
  transform: rotateX(90deg) translateZ(25px);
}

.v-enter-to.celebrating,
.v-leave-from.celebrating {
  transform: rotateX(0deg) translateZ(25px);
}

.v-leave-to.celebrating {
  transform: rotateX(-90deg) translateZ(25px);
}
</style>
