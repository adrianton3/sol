(() => {
    'use strict'

    const {
        Subgrid,
        World,
        makeCanvas,
        evalScene,
        scaleScene,
        sampleScenes,
    } = window.sol

    const scene = scaleScene(evalScene(sampleScenes.s1, 0), 1)

    const world = new World(scene)
    const canvas = makeCanvas(document.getElementById('canvas'), scene.size, scene.shape)
    const subgrid = new Subgrid(scene.size)

    function step () {
        for (let i = 0; i < 10; i++) {
            world.draw(subgrid)
            world.tick()
        }

        canvas.drawSubgrid(subgrid, 2.)

        if (world.threads.length > 0) {
            requestAnimationFrame(step)
        }
    }

    world.init(16670)
    step()
})()
