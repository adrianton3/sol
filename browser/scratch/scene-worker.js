'use strict'

self.sol = {}

importScripts(
    'math.js',
    'vec.js',
    '../../core/entities.js',
    '../../core/space.js',
    '../../core/emitters.js',
)

self.addEventListener('message', ({ data }) => {
    try {
        const entities = []
        const emitters = []

        function addEntity (...args) { entities.push(...args) }
        function addEmitter (...args) { emitters.push(...args) }

        const code = [
            `const { ${Object.getOwnPropertyNames(Math).join(', ')} } = Math`,
            `const { vec, mix, clamp, vecFromAngle } = self.sol`,
            `const ball = (...args) => self.sol.entities.ball(...args, 'red')`, // hack; only interesting type is 'red' now
            `const { ${Object.getOwnPropertyNames(self.sol.emitters).join(', ')} } = self.sol.emitters`,
            '',
            data.body,
        ].join('\n')

        Function('time', 'addEntity', 'addEmitter', code)(data.time, addEntity, addEmitter)

        self.postMessage({ type: 'scene', entities, emitters })
    } catch (ex) {
        console.log(ex)
        self.postMessage({ type: 'error', message: ex.message })
    }
})
