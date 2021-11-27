(() => {
    'use strict'

    const { Subgrid } = typeof module === 'undefined' ? self.sol : require('./subgrid')
    const { emitThread } = typeof module === 'undefined' ? self.sol : require('./emitters')
    const { Space } = typeof module === 'undefined' ? self.sol : require('./space')
    const { World } = typeof module === 'undefined' ? self.sol : require('./world')
    const { evalScene } = typeof module === 'undefined' ? self.sol : require('./ev/ev')
    const { scaleScene } = typeof module === 'undefined' ? self.sol : require('./scene')

    function render (sceneRaw, time, { threadCount, scale }) {
        const scene = scaleScene(evalScene(sceneRaw, time), scale)
        const subgrid = new Subgrid(scene.size)

        const world = new World(scene)

        world.init(threadCount)

        while (world.threads.length > 0) {
            world.draw(subgrid)
            world.tick()
        }

        return subgrid
    }

	function renderMotion (sceneRaw, time, frameTime, subframeCount, { threadCount, scale }) {
        const subgrid = new Subgrid(scaleScene(evalScene(sceneRaw, 0), scale).size)

        for (let i = 0; i < subframeCount; i++) {
            const scene = scaleScene(evalScene(sceneRaw, time + i * (frameTime / subframeCount)), scale)
            const world = new World(scene)

            world.init(threadCount / subframeCount)

            while (world.threads.length > 0) {
                world.draw(subgrid)
                world.tick()
            }
        }

        return subgrid
    }

    function renderAlt (sceneRaw, time, { threadCount, scale }) {
        const scene = scaleScene(evalScene(sceneRaw, time), scale)
        const subgrid = new Subgrid(scene.size)
        const position = { x: -scene.size.width / 2, y: -scene.size.height / 2 }
        const mask = new Space(scene.entities)
        const threadCountPerEmitter = Math.floor(threadCount / scene.emitters.length)

        for (const emitter of scene.emitters) {
            for (let i = 0; i < threadCountPerEmitter; i++) {
                const thread = emitThread(emitter)

                while (true) {
                    if (scene.shape === 'circle') {
                        const radiusSquared = (Math.min(scene.size.width, scene.size.height) / 2) ** 2

                        if (thread.x ** 2 + thread.y ** 2 >= radiusSquared) {
                            break
                        }
                    } else {
                        if (
                            thread.x <= position.x ||
                            thread.y <= position.y ||
                            thread.x >= position.x + scene.size.width - 1 ||
                            thread.y >= position.y + scene.size.height - 1
                        ) {
                            break
                        }
                    }

                    subgrid.add(thread.x - position.x, thread.y - position.y)
                    thread.tick(mask)
                }
            }
        }

        return subgrid
    }



    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        render,
        renderMotion,
        renderAlt,
    })
})()
