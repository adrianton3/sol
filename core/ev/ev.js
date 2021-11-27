(() => {
    'use strict'

    const { mix, clamp, lerp } = typeof module === 'undefined' ? self.sol : require('./math')
    const { vec, vecFromAngle } = typeof module === 'undefined' ? self.sol : require('./vec')
    const { makeEmitter } = typeof module === 'undefined' ? self.sol : require('../emitters')
    const { makeEntity } = typeof module === 'undefined' ? self.sol : require('../entities')

    function evalScene (sceneRaw, time) {
        if (sceneRaw.emitters != null && sceneRaw.entities != null) {
            return sceneRaw
        }

        {
            const entities = []
            const emitters = []

            function addEntity (...args) { entities.push(...args) }
            function addEmitter (...args) { emitters.push(...args) }

            const namespace = {
                mix, clamp, lerp,
                vec, vecFromAngle,
                makeEmitter,
                makeEntity,
            }

            const code = [
                `const { ${Object.getOwnPropertyNames(Math).join(', ')} } = Math`,
                `const { mix, clamp, lerp } = namespace`,
                `const { vec, vecFromAngle } = namespace`,
                `const { ${Object.getOwnPropertyNames(makeEmitter).join(', ')} } = namespace.makeEmitter`,
                `const ball = (...args) => namespace.makeEntity.ball(...args, 'red')`, // hack; only interesting type is 'red' now
                '',
                sceneRaw.body,
            ].join('\n')

            Function('time', 'addEntity', 'addEmitter', 'namespace', code)(time, addEntity, addEmitter, namespace)

            return {
                size: sceneRaw.size,
                shape: sceneRaw.shape,
                emitters,
                entities,
            }
        }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        evalScene,
    })
})()
