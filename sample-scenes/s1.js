(() => {
    'use strict'

    const { emitters } = typeof module === 'undefined' ? self.sol : require('../core/emitters')
    const { makeBall } = typeof module === 'undefined' ? self.sol : require('../core/space')

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
                    makeBall(Math.cos(angle) * radius, Math.sin(angle) * radius, 10., 'red')
                )
            }

            return entities
        },
        emitters: [
            emitters.outward({ x: 50, y: 0 }, 20),
        ],
    }

    if (typeof module === 'undefined') {
        self.sol.sampleScenes = self.sol.sampleScenes || {}
        Object.assign(self.sol.sampleScenes, { s1 })
    } else {
        Object.assign(module.exports, s1)
    }
})()
