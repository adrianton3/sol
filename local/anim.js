'use strict'

const { render } = require('../core/render')
const { write, makeGif } = require('./common')

const scene = require('../sample-scenes/s1')

function makePrefix () {
    const now = new Date
    return `_${now.getFullYear()}${String(now.getMonth()).padStart(2, '0')}${String(now.getDay()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

const prefix = makePrefix()

const writes = []

const frameCount = 30
for (let frame = 0; frame < frameCount; frame++) {
    const subgrid = render(scene, frame / frameCount, 16670)
    writes.push(write(subgrid, `out/${prefix}_${frame}.png`))

    console.log('frame', frame, '/', frameCount)
}

Promise.all(writes).then((files) => { makeGif(files, prefix) })
