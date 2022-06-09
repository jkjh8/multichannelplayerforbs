export function hms(seconds) {
  if (seconds) {
    const hour =
      parseInt(seconds / 3600) < 10
        ? '0' + parseInt(seconds / 3600)
        : parseInt(seconds / 3600)
    const min =
      parseInt((seconds % 3600) / 60) < 10
        ? '0' + parseInt((seconds % 3600) / 60)
        : parseInt((seconds % 3600) / 60)
    const sec =
      seconds % 60 < 10
        ? '0' + Math.round(seconds % 60)
        : Math.round(seconds % 60)
    if (hour === '00') {
      return `${min}:${sec}`
    }
    return `${hour}:${min}:${sec}`
  } else {
    return '00:00'
  }
}
