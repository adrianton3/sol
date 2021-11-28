'use strict'

const { renderAlt } = require('../core/render')
const { writePng } = require('./common')


function run ({ sceneRaw, threadCount, scale, prefix }) {
    const subgrid = renderAlt(sceneRaw, 0, { threadCount, scale })

    const outFile = `out/${prefix}.png`
    writePng(subgrid, outFile).then(() => {
        console.log('done')
        console.log(outFile)
    })
}

Object.assign(module.exports, {
    run,
})
