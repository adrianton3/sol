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
    let editor

    const elements = {
        statusBar: document.getElementById('status-bar'),
        status: document.getElementById('status'),

        renderBar: document.getElementById('render-bar'),
        render: document.getElementById('render'),
        renderStatus: document.getElementById('render-status'),
        renderRequest: document.getElementById('render-request'),
    }

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

    function handleRender () {
        const source = editor.getValue()

        fetch(`${location.protocol}//${location.hostname}:8005/render`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scene: {
                    size,
                    shape,
                    body: source,
                },
                frameCount: 30,
                subframeCount: 8,
                threadCount: 16670,
                scale: 1,
                exposureMultiplier: 1,
            })
        }).then((response) => {
            elements.renderStatus.textContent = response.status === 503 ? 'still busy with' : 'rendering'
            return response.json()
        }).then((body) => {
            elements.renderRequest.textContent = body.renderRequest
            elements.renderRequest.href = `${location.origin}/out/${body.renderRequest}.gif`
        })
    }

    function setupUi () {
        elements.renderBar.hidden = false

        elements.render.addEventListener('click', handleRender)
    }

    function setupTicker () {
        elements.statusBar.hidden = false

        function poll () {
            fetch(`${location.protocol}//${location.hostname}:8005/`)
            .then((response) => response.json())
            .then((body) => {
                elements.status.textContent = body.status

                if (body.status === 'idle') {
                    elements.renderStatus.textContent = 'idle/done'
                }

                setTimeout(poll, 500)
            })
        }

        poll()
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

                canvas.drawSubgrid(subgrid, 2)

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

                canvas.drawSubgrid(subgrid, 2)

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

    editor = setupEditor('in-scene', handleSource)

    if (location.hostname === '127.0.0.1') {
        setupUi()
        setupTicker()
    }
})()
