<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  audioOutputDevices as outputs,
  getAudioDevices,
  playerStatus as ps,
  players
} from 'src/composables/useStatus'
import { hms } from 'src/composables/useTime'
import IconBtn from 'src/components/iconBtn.vue'

function eventCallback(event, index) {
  // console.log(event)
  switch (event.type) {
    case 'durationchange':
      ps.value[index].duration = players[index].duration
      break
    case 'timeupdate':
      ps.value[index].currentTime = players[index].currentTime
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
  if (event === 'start') {
    players[index].pause()
  } else {
    if (ps.value[index].playing) {
      players[index].play()
    }
  }
}

async function makeAudioPlayer(index) {
  players[index] = new Audio()
  players[index].crossOrigin = ''
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

function fnOpenFile(index) {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = (_) => {
    const files = Array.from(input.files)
    ps.value[index].file = files[0]
    console.log(ps.value[index])
  }
  input.click()
}

onMounted(async () => {
  await getAudioDevices()
  makeAudioPlayer(0)
})
</script>

<template>
  <div v-for="(player, index) in ps" :key="index">
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
                @click="fnOpenFile(index)"
              >
                <q-tooltip>Open</q-tooltip>
              </q-btn>
              <q-btn flat round icon="settings" color="grey-8">
                <q-tooltip>Setting</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar
              round
              icon="svguse:icons.svg#logo"
              color="grey-2"
              size="48px"
            />
          </q-item-section>
          <q-item-section>
            <div v-if="players[index] && players[index].src">
              {{ players[index].src }}
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
          <IconBtn
            name="play_arrow"
            msg="PLAY"
            @click="players[index].play()"
          />
          <IconBtn name="pause" msg="PAUSE" @click="players[index].pause()" />
          <IconBtn name="stop" msg="STOP" @click="players[index].src = ''" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
