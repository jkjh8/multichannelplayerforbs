<script setup>
import { useDialogPluginComponent } from 'quasar'
import { audioOutputDevices as outputs } from 'src/composables/usePlayers'

const props = { player: Object }

const { device } = toRefs(props.player)

const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div>디바이스 선택</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
