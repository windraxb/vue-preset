'use strict'
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const utils = require('@windraxb/cloud-utils')

const pkg = require('../package.json')
const outDir = `${path.resolve(__dirname, '../')}/${pkg.name}_${utils.formatDate(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.zip`

const output = fs.createWriteStream(outDir)
const archive = archiver('zip', {
  zlib: { level: 9 }
})

output.on('close', () => {
  console.log(archive.pointer() + ' total bytes')
  console.log('archiver has been finalized and the output file descriptor has closed.')
})

output.on('end', () => {
  console.log('Data has been drained')
})

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err
  }
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

archive.directory('./dist/', false)

archive.finalize()
