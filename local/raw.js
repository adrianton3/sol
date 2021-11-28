'use strict'

const fs = require('fs')

const Jimp = require('jimp')


function getMax (array) {
    let max = 0.

    for (let i = 0; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i]
        }
    }

    return max
}

function compose (filesIn, fileOut) {
    const buffer = fs.readFileSync(filesIn[0])
    const sum = new Float64Array(buffer.buffer, buffer.byteOffset, buffer.length / 8)

    for (let i = 1; i < filesIn.length; i++) {
        const buffer = fs.readFileSync(filesIn[i])
        const values = new Float64Array(buffer.buffer, buffer.byteOffset, buffer.length / 8)

        for (let j = 0; j < sum.length; j++) {
            sum[j] += values[j]
        }
    }

    fs.writeFileSync(fileOut, new Buffer(sum.buffer))
}

function guessSize (flatSize) {
    const widthCandidate = Math.sqrt(flatSize)
    if (Number.isInteger(widthCandidate) && Number.isInteger(Math.log2(widthCandidate))) {
        return { width: widthCandidate, height: widthCandidate }
    }

    const widthMore = 2 ** Math.ceil(Math.log2(widthCandidate))

    if (flatSize % widthMore !== 0) {
        const widthLess = 2 ** Math.floor(Math.log2(widthCandidate))
        return { width: widthLess, height: flatSize / widthLess }
    }

    const heightMore = flatSize / widthMore

    const widthLess = 2 ** Math.floor(Math.log2(widthCandidate))
    const heightLess = flatSize / widthLess

    return Math.abs(widthMore - heightMore) < Math.abs(widthLess - heightLess)
        ? { width: widthMore, height: heightMore }
        : { width: widthLess, height: heightLess }
}

function rawToPng (fileIn, fileOut, multiplierMaybe) {
    const buffer = fs.readFileSync(fileIn)
    const values = new Float64Array(buffer.buffer, buffer.byteOffset, buffer.length / 8)

    // ---
    const { width, height } = guessSize(values.length) // hack

    const imageData = new Uint8ClampedArray(width * height * 4)

    const multiplier = multiplierMaybe != null
        ? multiplierMaybe
        : 255. / getMax(values)

    for (let i = 0, p = 0; i < values.length; i++, p += 4) {
        const value = values[i]

        imageData[p + 0] = value * multiplier
        imageData[p + 1] = value * multiplier
        imageData[p + 2] = value * multiplier
        imageData[p + 3] = 255
    }

    // ---
    return new Promise((resolve, reject) => {
        new Jimp({
            data: imageData,
            width,
            height,
        }, (err, image) => {
            image.write(fileOut, () => { resolve(fileOut) })
        })
    })
}

Object.assign(module.exports, {
    compose,
    rawToPng,
})
