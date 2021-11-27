'use strict'

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { makePrefix } = require('./common')

const app = express()

app.use(cors())
app.use(bodyParser.raw({ type: 'application/json', limit: '10mb', extended: true }))

let state = {
    status: 'idle',
    renderRequest: null,
    errData: null,
}

app.get('/', (req, res) => {
    res.json(state)
})

app.post('/render', (req, res) => {
    if (state.status !== 'idle') {
        res.status(503).json(state)
        return
    }

    const prefix = makePrefix()

    state.status = 'busy'
    state.renderRequest = prefix
    state.errData = null

    const payload = JSON.parse(req.body)

    res.json(state)

    fs.writeFileSync(
        path.join(__dirname, 'tmp', `${prefix}.request`),
        JSON.stringify(payload.scene),
    )

    const animProcess = child_process.spawn(
        'node',
        [
            'local/anim-cli.js',
            path.join(__dirname, 'tmp', `${prefix}.request`),
            `${payload.frameCount}`,
            `${payload.subframeCount}`,
            `${payload.threadCount}`,
            `${payload.scale}`,
            `${payload.exposureMultiplier}`,
            prefix,
        ],
    )

    let outData = ''
    animProcess.stdout.on('data', (data) => {
        outData += data
    })

    let errData = ''
    animProcess.stderr.on('data', (data) => {
        errData += data
    })

    animProcess.on('close', (code) => {
        state.status = 'idle'

        if (code !== 0) {
            state.errData = errData
        }

        console.log('done', state.renderRequest, 'exit-code', code)

        if (code !== 0) {
            console.log(errData)
        }
    })
})

app.listen(8005)
