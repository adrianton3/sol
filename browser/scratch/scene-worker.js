'use strict'

self.sol = {}

importScripts(
    '../../core/ev/math.js',
    '../../core/ev/vec.js',

    '../../core/emitters.js',
    '../../core/entities.js',

    '../../core/ev/ev.js',
)

self.addEventListener('message', ({ data }) => {
    try {
        const scene = self.sol.evalScene({ body: data.body }, 0)
        self.postMessage({ type: 'scene', emitters: scene.emitters, entities: scene.entities })
    } catch (ex) {
        console.log(ex)
        self.postMessage({ type: 'error', message: ex.message })
    }
})
