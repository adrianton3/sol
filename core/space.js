(() => {
    'use strict'

    function Space (entities) {
        this.entities = entities
    }

    Space.prototype.get = function (x, y) {
        let deltaMin = Number.MAX_VALUE

        for (const entity of this.entities) {
            const distSquared = (x - entity.position.x) ** 2 + (y - entity.position.y) ** 2

            if (distSquared <= entity.radius ** 2) {
                return { entity, dist: 0. }
            }

            const delta = Math.sqrt(distSquared) - entity.radius
            if (delta < deltaMin) {
                deltaMin = delta
            }
        }

        return { entity: null, dist: deltaMin }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        Space,
    })
})()
