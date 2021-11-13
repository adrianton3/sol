(() => {
    'use strict'

    const {
        Subgrid,
        World,
        makeCanvas,
        makeScener,
        isValidSource,
        scenesAreEqual,
        sampleScenes,
    } = window.sol

    const size = { width: 512, height: 512 }
    const shape = 'square'

    const canvas = makeCanvas(document.getElementById('canvas'), size, shape)

    const makeScene = makeScener()

    function setupEditor (elementId, handleChange) {
        const editor = ace.edit(elementId)
        editor.setTheme('ace/theme/monokai')
        editor.session.setMode('ace/mode/javascript')

        editor.getSession().on('change', () => {
            handleChange(editor.getValue())
        })

        editor.setOptions({ fontSize: '12pt' })

        editor.session.$worker.send('changeOptions', [{ asi: true }]);

        editor.setValue(sampleScenes.s2, -1)

        return editor
    }

    const renderInc = (() => {
        let requestHandle = null

        return (world, subgrid, threadCount, done) => {
            let frameTimeSum = 0
            const substepCount = 60
            let stepIndex = 0

            function step () {
                const startTime = performance.now()

                for (let i = 0; i < substepCount; i++) {
                    if (world.threads.length === 0) {
                        done({ frameTimeAverage: frameTimeSum / (stepIndex + 1) })
                        return
                    }

                    world.draw(subgrid)
                    world.tick()
                }

                canvas.drawSubgrid(subgrid, 7)

                frameTimeSum += performance.now() - startTime

                stepIndex++

                requestAnimationFrame(step)
            }

            world.init(threadCount)

            if (requestHandle != null) {
                cancelAnimationFrame(requestHandle)
            }

            step()
        }
    })()

    const renderOver = (() => {
        let requestHandle = null

        return (world, subgrid, threadCount, done) => {
            let frameTimeSum = 0
            const stepCount = 25
            let stepIndex = 0

            function step () {
                if (stepIndex >= stepCount) {
                    done({ frameTimeAverage: frameTimeSum / (stepIndex + 1) })
                    return
                }

                const startTime = performance.now()

                world.init(Math.floor(threadCount / stepCount))

                while (world.threads.length > 0) {
                    world.draw(subgrid)
                    world.tick()
                }

                canvas.drawSubgrid(subgrid, 7)

                frameTimeSum += performance.now() - startTime

                stepIndex++

                requestHandle = requestAnimationFrame(step)
            }

            if (requestHandle != null) {
                cancelAnimationFrame(requestHandle)
            }

            step()
        }
    })()

    const handleScene = (() => {
        let scenePrev = null

        return (scene) => {
            Object.assign(scene, { size, shape })

            if (scenesAreEqual(scenePrev, scene)) {
                return
            }

            scenePrev = scene

            const world = new World(scene)
            const subgrid = new Subgrid(size)

            renderInc(world, subgrid, 16670, (frameTimeAverage) => { console.log('done', frameTimeAverage) })
            // renderOver(world, subgrid, 16670, (frameTimeAverage) => { console.log('done', frameTimeAverage) })
        }
    })()

    function handleError (...args) {
        console.log(...args)
    }

    function handleSource (source) {
        if (isValidSource(source)) {
            makeScene({ body: source, time: 0 }, handleScene, handleError)
        }
    }

    setupEditor('in-scene', handleSource)
})()