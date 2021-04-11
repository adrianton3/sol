(() => {
    'use strict'

    const {
        Subgrid,
        World,
        makeCanvas,
        sampleScenes,
    } = window.sol

    const scene = sampleScenes.s1

    const world = new World({
        size: scene.size,
        shape: scene.shape,
        entities: scene.entities(0),
        emitters: scene.emitters,
    })

    const canvas = makeCanvas(document.getElementById('canvas'), scene.size, scene.shape)

    const subgrid = new Subgrid(scene.size)

    function step () {
        for (let i = 0; i < 10; i++) {
            world.draw(subgrid)
            world.tick()
        }

        canvas.drawSubgrid(subgrid, 7)

        if (world.threads.length > 0) {
            requestAnimationFrame(step)
        }
    }

    world.init(16670)
    step()
})()
