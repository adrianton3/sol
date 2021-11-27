'use strict'

const single = require('./single')
const { readScene } = require('./common')


if (process.argv.length < 2) {
    console.error('use: node single-cli.js <scene-file> [thread-count] [scale]')
    process.exit(1)
}

single.run({
    sceneRaw: readScene(process.argv[2]),
    threadCount: process.argv[3] != null ? Number(process.argv[3]) : 16670,
    scale: process.argv[4] != null ? Number(process.argv[4]) : 1,
})
