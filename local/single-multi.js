'use strict'

const path = require('path')
const os = require('os')
const child_process = require('child_process')

const { scaleSceneSize } = require('../core/scene')
const { readScene } = require('./common')
const { compose, rawToPng } = require('./raw')


function dispatch (sceneFile, prefix, index, { threadCount, scale }) {
    return new Promise((resolve, reject) => {
        const renderProcess = child_process.spawn(
            'node',
            [
                path.join(__dirname, 'single-partial.js'),
                sceneFile,
                `${threadCount}`,
                `${scale}`,
                `${prefix}_${index}`,
            ],
        )

        renderProcess.on('close', (code) => {
            if (code === 0) {
                resolve(`${prefix}_${index}`)
            }
        })
    })
}

function dispatchAll (sceneFile, prefix, dispatchCount, { threadCount, scale }) {
    const renders = []

    const threadCountDispatch = Math.floor(threadCount / dispatchCount)

    for (let i = 0; i < dispatchCount; i++) {
        renders.push(dispatch(sceneFile, prefix, i, { threadCount: threadCountDispatch, scale }))
    }

    return Promise.all(renders)
}

function getDispatchCount (sceneSize) {
    const cpuCount = os.cpus().length
    const dispatchCountByCpu = cpuCount >= 4 ? cpuCount - 1 : cpuCount

    const freeMemory = os.freemem()
    const memoryPerProcess = sceneSize.width * sceneSize.height * 4
    const dispatchCountByMemory = Math.floor(freeMemory / memoryPerProcess)

    return Math.max(1, Math.min(dispatchCountByCpu, dispatchCountByMemory))
}

function run ({ sceneFile, threadCount, scale, prefix }) {
    const scaledSceneSize = scaleSceneSize(readScene(sceneFile), scale)
    const dispatchCount = getDispatchCount(scaledSceneSize)

    console.log('dispatch count', dispatchCount)

    dispatchAll(sceneFile, prefix, dispatchCount, { threadCount, scale }).then((renderResults) => {
        compose(
            renderResults.map((renderResult) => path.join(__dirname, 'tmp-partials', `${renderResult}.raw`)),
            path.join(__dirname, 'tmp-partials', `${prefix}.raw`),
        )

        rawToPng(
            path.join(__dirname, 'tmp-partials', `${prefix}.raw`),
            path.join('out', `${prefix}.png`),
        )

        console.log('done')
        console.log(path.join('out', `${prefix}.png`))
    })
}

if (process.argv.length < 6) {
    console.error('use: node single-multi.js <scene-file> [thread-count] [scale] [prefix]')
    process.exit(1)
}

run({
    sceneFile: process.argv[2],
    threadCount: Number(process.argv[3]),
    scale: Number(process.argv[4]),
    prefix: process.argv[5],
})
