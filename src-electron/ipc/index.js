import { ipcMain, dialog } from 'electron'

ipcMain.handle('file', (e) => {
  const file = dialog.showOpenDialogSync()
  console.log(file)
})
