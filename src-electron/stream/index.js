import express from 'express'
import fs from 'fs'

const stream = express()
stream.use(express.json())
stream.use(express.urlencoded({ extended: false }))

stream.get('/stream', (req, res) => {
  const { path, size, type } = req.query
  const file = fs.statSync(path)
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, '').split(' - ')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1
    const chunksize = end - start + 1
    const fileStream = fs.createReadStream(path, { start, end })
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': type
    })
    fileStream.pipe(res)
  } else {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': type
    })
    fs.createReadStream(file).pipe(res)
  }
})

stream.use((req, res, next) => {
  res.status(404).send('page not found')
})

export default stream

// module.exports.stream = function (req, res, next) {
//   const type = req.query.type
//   const file = req.query.file
//   const filePath = fs.statSync(file)
//   const fileSize = filePath.size
//   const range = req.headers.range
//   if (range) {
//     const parts = range.replace(/bytes=/, '').split(' - ')
//     const start = parseInt(parts[0], 10)
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
//     const chunksize = end - start + 1
//     const fileStream = fs.createReadStream(file, { start, end })
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': type
//     }
//     res.writeHead(206, head)
//     fileStream.pipe(res)
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': type
//     }
//     res.writeHead(200, head)
//     fs.createReadStream(filePath).pipe(res)
//   }
// }
