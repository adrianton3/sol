(() => {
    'use strict'

    const { Space } = typeof module === 'undefined' ? self.sol : require('./space')
    const { emitThreads } = typeof module === 'undefined' ? self.sol : require('./emitters')

    function World (scene) {
        this.size = scene.size
        this.position = { x: -scene.size.width / 2, y: -scene.size.height / 2 }
        this.shape = scene.shape
        this.emitters = scene.emitters
        this.mask = new Space(scene.entities)

        this.threads = []
    }

    World.prototype.init = function (count) {
        for (const emitter of this.emitters) {
            const threads = emitThreads(emitter, Math.floor(count / this.emitters.length))
            this.threads.push(...threads)
        }

        this.removeOutside()
    }

    function removeSwap (array, predicate) {
        let i = 0
        let newLength = array.length

        while (i < newLength) {
            if (predicate(array[i])) {
                i++
            } else {
                newLength--
                array[i] = array[newLength]
            }
        }

        array.length = newLength
    }

    World.prototype.removeOutside = function () {
        if (this.shape === 'circle') {
            const radiusSquared = (Math.min(this.size.width, this.size.height) / 2) ** 2

            removeSwap(this.threads, (thread) =>
                thread.x ** 2 + thread.y ** 2 < radiusSquared
            )
        } else {
            removeSwap(this.threads, (thread) =>
                thread.x >= this.position.x &&
                thread.y >= this.position.y &&
                thread.x < this.position.x + this.size.width - 1 &&
                thread.y < this.position.y + this.size.height - 1
            )
        }
    }

    World.prototype.tick = function () {
        for (const thread of this.threads) {
            thread.tick(this.mask)
        }

        this.removeOutside()
    }

    World.prototype.draw = function (subgrid) {
        for (const thread of this.threads) {
            subgrid.add(thread.x - this.position.x, thread.y - this.position.y)
        }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        World,
    })
})()
