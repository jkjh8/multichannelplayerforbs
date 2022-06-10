import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    ipcRenderer.invoke(channel, data)
  },
  handle: (channel, callable, event, data) => {
    ipcRenderer.on(channel, callable(event, data))
  }
})
