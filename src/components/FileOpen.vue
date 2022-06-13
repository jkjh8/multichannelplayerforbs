<script setup>
import { ref } from 'vue'
import { playerStatus as ps, players } from 'src/composables/usePlayers'
const props = defineProps({ index: Number })
const emit = defineEmits(['change'])
const input = ref(null)

function updateFile(event) {
  ps.value[props.index].file = event.target.files[0]
  players[props.index].src = `local://${ps.value[props.index].file.path}`
}
</script>

<template>
  <input v-show="false" ref="input" type="file" @change="updateFile" />
  <q-btn flat round icon="folder" color="yellow-8" @click="input.click()">
    <q-tooltip class="tooltip">OPRN</q-tooltip>
  </q-btn>
</template>
