<script setup>
import { ref, reactive, onMounted } from 'vue'
import { playerStatus } from 'src/composables/useStatus'
import { hms } from 'src/composables/useTime'
import IconBtn from 'src/components/iconBtn.vue'

const players = []
// const audioContext = []
// const controlApi = []
// const outputGain = []

function durationChange(time, index) {
  console.log('duration', time, index)
}

function timeUpdate(time, index) {
  console.log('timeupdate', time, index)
}

function setPlay(index) {
  console.log('play', index)
}

function setPause(index) {
  console.log('pause', index)
}

function setCanPlay(index) {
  console.log('canplay', index)
}

function ended(index) {
  console.log('ended', index)
}

function volumeChange(index) {
  console.log(index)
}
const devices = ref([])
async function getAudioDevices() {
  const dvs = await navigator.mediaDevices.enumerateDevices()
  devices.value = dvs.filter((device) => device.kind === 'audiooutput')
}

function eventCallback(event, index) {
  // console.log(event)
  switch (event.type) {
    case 'durationchange':
      playerStatus.value[index].duration = players[index].duration
      break
    case 'timeupdate':
      playerStatus.value[index].currentTime = players[index].currentTime
      break
    case 'canplay':
      playerStatus.value[index].status = 'canplay'
      break
    case 'play':
      playerStatus.value[index].status = 'play'
      break
    case 'playing':
      playerStatus.value[index].playing = true
      break
    case 'ended':
      playerStatus.value[index].status = 'ended'
      playerStatus.value[index].playing = false
      break
    case 'emptied':
      playerStatus.value[index].status = 'emptied'
      playerStatus.value[index].playing = false
      break
  }
}

const openFile = ref(null)

const callbackEvents = [
  'durationchange',
  'timeupdate',
  'play',
  'playing',
  'pause',
  'canplay',
  'loadmetadata',
  'ended',
  'emptied'
]

function seek(event, index) {
  if (event === 'start') {
    players[index].pause()
  } else {
    if (playerStatus.value[index].playing) {
      players[index].play()
    }
  }
}

async function makeAudioPlayer(index) {
  players[index] = new Audio()
  players[index].crossOrigin = ''
  players[index].loop = playerStatus.value[index].loop
  await players[index].setSinkId(devices.value[3].deviceId)
  console.log(players[index].sinkId)
  for (let i = 0; i < callbackEvents.length; i++) {
    players[index].addEventListener(callbackEvents[i], (event) => {
      eventCallback(event, index)
    })
  }
  console.log(devices.value)

  players[index].src = playerStatus.value[index].src
  players[index].load()
  // audioContext[index] = new AudioContext()
  // controlApi[index] = audioContext[index].createMediaElementSource(
  //   players[index]
  // )
  // outputGain[index] = audioContext[index].createGain()
  // controlApi[index]
  //   .connect(outputGain[index])
  //   .connect(audioContext[index].destination)
}

function fnOpenFile(file) {
  console.log(file)
}

onMounted(async () => {
  await getAudioDevices()
  makeAudioPlayer(0)
})
</script>

<template>
  <input
    ref="openFile"
    type="file"
    @change="fnOpenFile($event.target.files[0])"
  />
  <div v-for="(player, index) in playerStatus" :key="index">
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
                @click="openFile.click()"
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
