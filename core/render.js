(() => {
    'use strict'

    const { Subgrid } = typeof module === 'undefined' ? self.sol : require('./subgrid')
    const { World } = typeof module === 'undefined' ? self.sol : require('./world')

    function render (scene, time, threadCount) { // scale
        const world = new World({
            size: scene.size,
            shape: scene.shape,
            entities: scene.entities(time),
            emitters: scene.emitters,
        })

        const subgrid = new Subgrid(scene.size)

        world.init(threadCount)

        while (world.threads.length > 0) {
            world.draw(subgrid)
            world.tick()
        }

        return subgrid
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        render,
    })
})()
