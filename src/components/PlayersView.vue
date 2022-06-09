<script setup>
import { ref, reactive, onMounted } from 'vue'
import { playerStatus } from 'src/composables/useStatus'
import { hms } from 'src/composables/useTime'
import IconBtn from 'src/components/iconBtn.vue'
const players = []

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

function eventCallback(event, index) {
  console.log(event)
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

function makeAudioPlayer(index) {
  players[index] = new Audio()
  players[index].addEventListener('durationchange', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('timeupdate', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('play', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('playing', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('pause', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('canplay', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('ended', (event) => {
    eventCallback(event, index)
  })
  players[index].addEventListener('emptied', (event) => {
    eventCallback(event, index)
  })

  players[index].src = playerStatus.value[0].src
  players[index].load()
  // players[index].muted = playerStatus[index].mute
  // players[index].volume = playerStatus[index].volume
}

onMounted(() => {
  makeAudioPlayer(0)
})
</script>

<template>
  <div v-for="(player, index) in playerStatus" :key="index">
    {{ players }}
    <div>
      <div>
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
            {{ player.src }}
          </q-item-section>
        </q-item>
        <div class="row no-wrap items-center q-gutter-x-md">
          <div>
            {{ hms(player.currentTime) }}
          </div>
          <q-slider
            v-model="player.currentTime"
            :min="0"
            :max="player.duration"
            label
          />
          <div>
            {{ hms(player.duration) }}
          </div>
        </div>
        <div>
          <IconBtn
            name="play_arrow"
            msg="PLAY"
            @click="players[index].play()"
          />
          <IconBtn name="pause" msg="PAUSE" @click="players[index].pause()" />
          <IconBtn name="stop" msg="STOP" @click="players[index].src = ''" />
        </div>
      </div>
    </div>
  </div>
</template>
