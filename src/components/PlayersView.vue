<script setup>
import { h, ref, reactive, onMounted } from 'vue'
import {
  audioOutputDevices as outputs,
  getAudioDevices,
  playerStatus as ps,
  players
} from 'src/composables/useStatus'
import { hms } from 'src/composables/useTime'
import IconBtn from 'src/components/iconBtn.vue'

let inputs = reactive([])
function eventCallback(event, index) {
  // console.log(event)
  switch (event.type) {
    case 'durationchange':
      ps.value[index].duration = players[index].duration
      break
    case 'timeupdate':
      ps.value[index].currentTime = players[index].currentTime
      if (ps.value[index].playing) {
        ps.value[index].status = 'play'
      }
      break
    case 'canplay':
      ps.value[index].status = 'canplay'
      break
    case 'play':
      ps.value[index].status = 'play'
      break
    case 'playing':
      ps.value[index].playing = true
      break
    case 'pause':
      ps.value[index].status = 'pause'
      break
    case 'ended':
      ps.value[index].status = 'ended'
      ps.value[index].playing = false
      break
    case 'emptied':
      ps.value[index].status = 'emptied'
      ps.value[index].playing = false
      break
  }
}

const openFile = ref(null)

const callbackEvents = [
  'canplay',
  'durationchange',
  'emptied',
  'ended',
  'loadmetadata',
  'pause',
  'play',
  'playing',
  'timeupdate'
]

function seek(event, index) {
  if (ps.value[index].playing) {
    if (event === 'start') {
      players[index].pause()
    } else {
      players[index].play()
    }
  }
}

async function makeAudioPlayer(index) {
  players[index] = new Audio()
  players[index].crossOrigin = 'any'
  players[index].loop = ps.value[index].loop
  // await players[index].setSinkId(devices.value[3].deviceId)
  console.log(players[index].sinkId)
  for (let i = 0; i < callbackEvents.length; i++) {
    players[index].addEventListener(callbackEvents[i], (event) => {
      eventCallback(event, index)
    })
  }
  players[index].src = ps.value[index].src
  players[index].load()
}

function fnOpenFile(event, index) {
  // inputs[index].value.click()
  ps.value[index].file = event.target.files[0]
  players[index].src = `local://${ps.value[index].file.path}`
  // const input = document.createElement('input')
  // input.type = 'file'
  // input.onchange = (_) => {
  //   const files = Array.from(input.files)
  //   ps.value[index].file = files[0]
  //   players[index].src = `local://${ps.value[index].file.path}`
  // }
  // input.click()
}

onMounted(async () => {
  await getAudioDevices()
  for (let i = 0; i < ps.value.length; i++) {
    makeAudioPlayer(i)
    inputs[i] = ref(null)
    console.log(inputs)
  }
})
</script>

<template>
  <div v-for="(player, index) in ps" :key="index">
    <input
      :ref="inputs[index]"
      type="file"
      @change="fnOpenFile($event, index)"
    />
    <q-card flat class="bg-grey-1" style="border-radius: 8px">
      <q-card-section class="q-pa-xs">
        <q-item>
          <q-item-section avatar>
            <q-avatar
              round
              icon="svguse:icons.svg#logo"
              color="grey-4"
              size="2rem"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="name">PLAYER {{ index + 1 }}</div>
            </q-item-label>
            <q-item-label caption>
              <div v-if="player.file">
                {{ player.file.name }}
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div>
              <q-btn
                flat
                round
                icon="folder"
                color="yellow-8"
                @click="inputs[index].value[0].click()"
              >
                <q-tooltip class="tooltip">OPRN</q-tooltip>
              </q-btn>
              <q-btn flat round icon="settings" color="grey-8">
                <q-tooltip class="tooltip">SETTING</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <div class="row no-wrap items-center q-gutter-x-md">
          <div>
            {{ hms(player.currentTime) }}
          </div>
          <q-slider
            v-model="player.currentTime"
            :min="0"
            :max="player.duration"
            label
            :label-value="hms(player.currentTime)"
            @pan="seek($event, index)"
            @update:model-value="
              players[index].currentTime = player.currentTime
            "
          />
          <div>
            {{ hms(player.duration) }}
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div>
          <q-btn
            v-if="ps[index].status !== 'play'"
            round
            flat
            icon="play_arrow"
            color="primary"
            @click="players[index].play()"
          >
            <q-tooltip class="tooltip">PLAY</q-tooltip>
          </q-btn>
          <q-btn
            v-else
            round
            flat
            icon="pause"
            color="yellow-10"
            @click="players[index].pause()"
          >
            <q-tooltip class="tooltip">PAUSE</q-tooltip>
          </q-btn>
          <q-btn
            round
            flat
            icon="stop"
            color="red-10"
            @click=";[(players[index].src = ''), (ps[index].file = null)]"
          >
            <q-tooltip class="tooltip"> STOP </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
