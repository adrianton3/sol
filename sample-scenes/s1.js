(() => {
    'use strict'

    const sol = {
        emitters: require('../core/emitters').emitters,
        entities: require('../core/entities').entities,
    }

    const s1 = {
        size: {
            width: 512,
            height: 512,
        },
        shape: 'rectangle',
        entities (time) {
            const entities = []

            const count = 19
            const radius = 120

            const slice = (Math.PI * 2) / count

            for (let i = 0; i < count; i++) {
                const angle = slice * i + slice * time

                entities.push(
                    sol.entities.ball({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }, 10., 'red')
                )
            }

            return entities
        },
        emitters: [
            sol.emitters.outward({ x: 50, y: 0 }, 20),
        ],
    }

    Object.assign(module.exports, s1)
})()
