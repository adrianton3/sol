'use strict'

const { render } = require('../core/render')
const { write } = require('./common')

const scene = require('../sample-scenes/s1')

function makePrefix () {
    const now = new Date
    return `_${now.getFullYear()}${String(now.getMonth()).padStart(2, '0')}${String(now.getDay()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
}

const subgrid = render(scene, 0, 16670)
write(subgrid, `out/${makePrefix()}_${0}.png`).then(() => { console.log('done') })
