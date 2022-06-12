import { ref } from 'vue'

const audioOutputDevices = ref([])
const players = []
const playerStatus = ref([
  {
    file: null,
    src: '',
    channel: 1,
    volume: 70,
    status: null,
    playing: false,
    mute: false,
    loop: false,
    duration: 0,
    currentTime: 0,
    ouputDevice: ''
  },
  {
    file: null,
    src: '',
    channel: 1,
    volume: 70,
    status: null,
    playing: false,
    mute: false,
    loop: false,
    duration: 0,
    currentTime: 0,
    ouputDevice: ''
  }
])

const getAudioDevices = async () => {
  const dvs = await navigator.mediaDevices.enumerateDevices()
  audioOutputDevices.value = dvs.filter(
    (device) => device.kind === 'audiooutput'
  )
}

export { players, playerStatus, audioOutputDevices, getAudioDevices }
