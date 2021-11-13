'use strict'

const { render, renderMotion } = require('../core/render')
const { write, makeGif } = require('./common')

const scene = require('../sample-scenes/s1')

function makePrefix () {
    const now = new Date
    return `_${now.getFullYear()}${String(now.getMonth()).padStart(2, '0')}${String(now.getDay()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

function run ({ frameCount, subframeCount, threadCount }) {
    const prefix = makePrefix()

    const writes = []

    for (let frame = 0; frame < frameCount; frame++) {
        const subgrid = renderMotion(
            scene,
            frame / frameCount,
            (1 / frameCount) * .75,
            subframeCount,
            threadCount,
        )

        writes.push(write(subgrid, `out/${prefix}_${frame}.png`))

        console.log('frame', frame + 1, '/', frameCount)
    }

    Promise.all(writes).then((files) => {
        makeGif(files, prefix, { framerate: frameCount }) // allow less/more than 1 second
        console.log('done')
    })
}


run({
    threadCount: process.argv[2] != null ? Number(process.argv[2]) : 16670,
    frameCount: process.argv[3] != null ? Number(process.argv[3]) : 30,
    subframeCount: process.argv[4] != null ? Number(process.argv[4]) : 8,
})
