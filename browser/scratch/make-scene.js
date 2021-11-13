(() => {
    'use strict'

    function makeScener () {
        let worker = null
        let timeoutHandle = null

        function initWorker (handleScene, handleError) {
            worker = new Worker('scene-worker.js')

            worker.addEventListener('message', ({ data }) => {
                if (data.type === 'error') {
                    handleError(data.message)
                } else if (data.type === 'scene') {
                    clearTimeout(timeoutHandle)
                    handleScene({ entities: data.entities, emitters: data.emitters })
                }
            })
        }

        return (message, handleScene, handleError) => {
            if (worker == null) {
                initWorker(handleScene, handleError)
            }

            worker.postMessage(message)

            timeoutHandle = setTimeout(() => {
                worker.terminate()
                handleError('timeout')
                initWorker(handleScene, handleError)
            }, 50)
        }
    }

    Object.assign(self.sol, {
        makeScener,
    })
})()