(() => {
    'use strict'

    const {
        emitters,
        makeBall,
    } = window.sol

    const s1 = {
        size: {
            width: 512,
            height: 512,
        },
        shape: 'circle',
        entities: (() => {
            const entities = []

            const count = 19
            const radius = 120

            for (let i = 0; i < count; i++) {
                const angle = Math.PI * 2 * (i / count)

                entities.push(
                    makeBall(Math.cos(angle) * radius, Math.sin(angle) * radius, 10., 'red')
                )
            }

            return entities
        })(),
        emitters: [
            emitters.outward({ x: 50, y: 0 }, 20),
        ],
    }

    Object.assign(window.sol, {
        sampleScenes: {
            s1,
        },
    })
})()
