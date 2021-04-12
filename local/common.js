'use strict'

const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

const Jimp = require('jimp')


function subgridToRgba (subgrid, multiplier) {
    const imageData = new Uint8ClampedArray(subgrid.sizePot.width * subgrid.sizePot.height * 4)

    for (let i = 0, p = 0; i < subgrid.grid.length; i++, p += 4) {
        const value = subgrid.grid[i]

        imageData[p + 0] = value * multiplier
        imageData[p + 1] = value * multiplier
        imageData[p + 2] = value * multiplier
        imageData[p + 3] = 255
    }

    return imageData
}

function write (subgrid, file) {
    return new Promise((resolve, reject) => {
        new Jimp({
            data: subgridToRgba(subgrid, 7),
            width: subgrid.sizePot.width,
            height: subgrid.sizePot.height,
        }, (err, image) => {
            image.write(file, () => { resolve(file) })
        })
    })
}

function makeGif (files, prefix, { framerate }) {
    fs.writeFileSync(
        path.join(__dirname, 'out', 'list.txt'),
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
        { cwd: path.join(__dirname, 'out') },
    )
}

Object.assign(module.exports, {
    write,
    makeGif,
})
