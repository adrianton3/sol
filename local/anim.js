'use strict'

const { render, renderMotion } = require('../core/render')
const { writePng, makeGif } = require('./common')


function run ({ sceneRaw, frameCount, subframeCount, threadCount, scale, exposureMultiplier, prefix }) {
    const writes = []

    for (let frame = 0; frame < frameCount; frame++) {
        const subgrid = renderMotion(
            sceneRaw,
            frame / frameCount,
            (1 / frameCount) * .75,
            subframeCount,
            { threadCount, scale }
        )

        writes.push(writePng(subgrid, `out/${prefix}_${frame}.png`, exposureMultiplier))

        console.log('frame', frame + 1, '/', frameCount)
    }

    Promise.all(writes).then((files) => {
        makeGif(files, prefix, { framerate: frameCount }) // allow less/more than 1 second
        console.log('done')
        console.log(`out/${prefix}.gif`)
    })
}

Object.assign(module.exports, {
    run,
})
