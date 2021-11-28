(() => {
    'use strict'

    const { scaleEmitter } = typeof module === 'undefined' ? self.sol : require('./emitters')
    const { scaleEntity } = typeof module === 'undefined' ? self.sol : require('./entities')

    function scaleScene (scene, s) {
        const size = {
            width: Math.floor(scene.size.width * s),
            height: Math.floor(scene.size.height * s),
        }

        const emitters = scene.emitters.map((emitter) => scaleEmitter(emitter, s))
        const entities = scene.entities.map((entity) => scaleEntity(entity, s))

        return {
            size,
            shape: scene.shape,
            emitters,
            entities,
        }
    }

    function scaleSceneSize (scene, s) {
        return {
            width: Math.floor(scene.size.width * s),
            height: Math.floor(scene.size.height * s),
        }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        scaleScene,
        scaleSceneSize,
    })
})()
