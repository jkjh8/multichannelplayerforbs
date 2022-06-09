<script setup>
import { ref } from 'vue'
const props = defineProps({
  name: String,
  size: String,
  color: String,
  msg: String
})
const clicked = ref(false)
const emit = defineEmits(['click'])

function onClick() {
  clicked.value = true
  emit('click')
  setTimeout(() => {
    clicked.value = false
  }, 1000)
}
</script>

<template>
  <q-icon
    :class="clicked ? 'animate__animated animate__heartBeat' : ''"
    style="cursor: pointer"
    :name="props.name"
    :size="props.size ?? 'sm'"
    :color="props.color ?? 'primary'"
    @click.prevent.stop="onClick"
  >
    <q-tooltip v-if="props.msg">
      {{ props.msg }}
    </q-tooltip>
  </q-icon>
</template>

<style scoped>
q-icon:hover {
  color: #ff00ff;
}
</style>
