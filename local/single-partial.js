'use strict'

const path = require('path')

const { renderAlt } = require('../core/render')
const { readScene, writeSubgrid, ensureTmp } = require('./common')


function run ({ sceneRaw, threadCount, scale, prefix }) {
    const subgrid = renderAlt(sceneRaw, 0, { threadCount, scale })

    ensureTmp()
    const outFile = path.join(__dirname, 'tmp-partials', `${prefix}.raw`)
    writeSubgrid(subgrid, outFile).then(() => {
        console.log('done')
        console.log(outFile)
    })
}

if (process.argv.length < 6) {
    console.error('use: node single-partial.js <scene-file> [thread-count] [scale] [prefix]')
    process.exit(1)
}

run({
    sceneRaw: readScene(process.argv[2]),
    threadCount: Number(process.argv[3]),
    scale: Number(process.argv[4]),
    prefix: process.argv[5],
})

