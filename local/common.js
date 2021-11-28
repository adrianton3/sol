'use strict'

const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

const Jimp = require('jimp')


function getSubgridMax (subgrid) {
    let max = 0.

    for (let i = 0; i < subgrid.grid.length; i++) {
        if (subgrid.grid[i] > max) {
            max = subgrid.grid[i]
        }
    }

    return max
}

function subgridToRgba (subgrid, multiplierMaybe) {
    const imageData = new Uint8ClampedArray(subgrid.sizePot.width * subgrid.sizePot.height * 4)

    const multiplier = multiplierMaybe != null
        ? multiplierMaybe
        : 255. / getSubgridMax(subgrid)

    for (let i = 0, p = 0; i < subgrid.grid.length; i++, p += 4) {
        const value = subgrid.grid[i]

        imageData[p + 0] = value * multiplier
        imageData[p + 1] = value * multiplier
        imageData[p + 2] = value * multiplier
        imageData[p + 3] = 255
    }

    return imageData
}

function writePng (subgrid, file, multiplier) {
    return new Promise((resolve, reject) => {
        new Jimp({
            data: subgridToRgba(subgrid, multiplier),
            width: subgrid.sizePot.width,
            height: subgrid.sizePot.height,
        }, (err, image) => {
            image.write(file, () => { resolve(file) })
        })
    })
}

function writeSubgrid (subgrid, file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, new Buffer(subgrid.grid.buffer), () => { resolve() })
    })
}

function makeGif (files, prefix, { framerate }) {
    const basePath = process.cwd()

    fs.writeFileSync(
        path.join(basePath, 'out', 'list.txt'),
        files.map((file) => `file ./${path.parse(file).base}`).join('\n'),
    )

    childProcess.spawnSync(
        'ffmpeg',
        [
            '-r', String(framerate),
            '-f', 'concat',
            '-safe', '0',
            '-i', 'list.txt',
            '-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', // " "
            '-loop', '0',
            '-y',
            `${prefix}.gif`,
        ],
        { cwd: path.join(basePath, 'out') },
    )
}

function readScene (file) {
    const source = fs.readFileSync(file, { encoding: 'utf8' })
    return Function(`return (${source})`)()
}

function makePrefix () {
    const now = new Date

    return [
        '_',
        now.getFullYear(),
        String(now.getMonth()).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
        '_',
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0')
    ].join('')
}

function ensureTmp () {
    ['tmp', 'tmp-partials'].forEach((entry) => {
        const dir = path.join(__dirname, entry)

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    })
}

Object.assign(module.exports, {
    getSubgridMax,
    writePng,
    writeSubgrid,
    makeGif,
    readScene,
    makePrefix,
    ensureTmp,
})
