'use strict'

const { render, renderAlt } = require('../core/render')
const { write } = require('./common')


function makePrefix () {
    const now = new Date
    return `_${now.getFullYear()}${String(now.getMonth()).padStart(2, '0')}${String(now.getDay()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

function run ({ sceneRaw, threadCount, scale }) {
    const subgrid = renderAlt(sceneRaw, 0, { threadCount, scale })

    const outFile = `out/${makePrefix()}_${0}.png`
    write(subgrid, outFile).then(() => {
        console.log('done')
        console.log(outFile)
    })
}

Object.assign(module.exports, {
    run,
})
