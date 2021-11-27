(() => {
    'use strict'

    function ball (position, radius, type) {
        return {
            position,
            radius,
            type,
        }
    }

    function scaleEntity (entity, s) {
        return ball(
            { x: entity.position.x * s, y: entity.position.y * s },
            entity.radius * s,
            entity.type,
        )
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        makeEntity: {
            ball,
        },
        scaleEntity,
    })
})()
