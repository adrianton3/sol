(() => {
    'use strict'

    const {
        Space,
        emitters,
    } = typeof module === 'undefined' ? self.sol : require('./emitters')

    function World ({ size, emitters, entities }) {
        this.size = size
        this.position = { x: -size.width / 2, y: -size.height / 2 }
        this.emitters = emitters
        this.mask = new Space(entities)

        this.threads = []
    }

    World.prototype.init = function (count) {
        for (const emitter of this.emitters) {
            const threads = emitters.emit(emitter, Math.floor(count / this.emitters.length))
            this.threads.push(...threads)
        }
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

    World.prototype.tick = function () {
        for (const thread of this.threads) {
            thread.tick(this)
        }

        {
            const minX = this.position.x
            const minY = this.position.y
            const maxX = this.position.x + this.size.width - 1
            const maxY = this.position.y + this.size.height - 1

            removeSwap(this.threads, (thread) =>
                thread.x > minX &&
                thread.y > minY &&
                thread.x < maxX &&
                thread.y < maxY
            )
        }
    }

    World.prototype.draw = function (subgrid) {
        for (const thread of this.threads) {
            subgrid.add(thread.x - this.position.x, thread.y - this.position.y, .3)
        }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        World,
    })
})()