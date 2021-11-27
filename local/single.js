'use strict'

const { render, renderAlt } = require('../core/render')
const { write } = require('./common')


function run ({ sceneRaw, threadCount, scale, prefix }) {
    const subgrid = renderAlt(sceneRaw, 0, { threadCount, scale })

    const outFile = `out/${prefix}.png`
    write(subgrid, outFile).then(() => {
        console.log('done')
        console.log(outFile)
    })
}

Object.assign(module.exports, {
    run,
})
