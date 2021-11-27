'use strict'

const anim = require('./anim')
const { readScene, makePrefix } = require('./common')


if (process.argv.length < 2) {
    console.error('use: node anim-cli.js <scene-file> [frame-count] [subframe-count] [thread-count] [scale] [exposure-multiplier]')
    process.exit(1)
}

anim.run({
    sceneRaw: readScene(process.argv[2]),
    frameCount: process.argv[3] != null ? Number(process.argv[3]) : 30,
    subframeCount: process.argv[4] != null ? Number(process.argv[4]) : 8,
    threadCount: process.argv[5] != null ? Number(process.argv[5]) : 16670,
    scale: process.argv[6] != null ? Number(process.argv[6]) : 1,
    exposureMultiplier: process.argv[7] != null ? Number(process.argv[7]) : 1,
    prefix: process.argv[8] != null ? process.argv[8] : makePrefix(),
})
