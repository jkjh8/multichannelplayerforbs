import { ref } from 'vue'

const playerStatus = ref([
  {
    player: null,
    src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
    channel: 1,
    volume: 70,
    status: null,
    playing: false,
    mute: false,
    duration: 0,
    currentTime: 0,
    ouputDevice: ''
  }
])

export { playerStatus }
