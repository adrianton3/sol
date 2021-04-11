(() => {
    'use strict'

    const {
        Subgrid,
        World,
    } = typeof module === 'undefined' ? self.sol : require('./emitters')

    function render (scene, threadCount) { // scale
        const world = new World(scene)
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