(() => {
    'use strict'

    const { actions } = typeof module === 'undefined' ? self.sol : require('./actions')

    const step = .5

    function Thread (x, y, angle) {
        this.x = x
        this.y = y

        this.incrementX = Math.cos(angle) * step
        this.incrementY = Math.sin(angle) * step

        this.state = ''

        this.skipCountdown = 0
    }

    Thread.prototype.tick = function (world) {
        if (this.skipCountdown > 0) {
            this.skipCountdown--
        } else {
            const { entity, dist } = world.mask.get(this.x, this.y)

            if (entity == null) {
                this.skipCountdown = Math.floor(dist / step)

                if (this.state !== '') {
                    actions[this.state].exit(this)
                    this.state = ''
                }
            } else {
                if (this.state === '') {
                    this.state = entity.type
                    actions[this.state].enter(this, entity)
                }
            }
        }

        this.x += this.incrementX
        this.y += this.incrementY
    }

    Thread.prototype.setAngle = function (angle) {
        this.incrementX = Math.cos(angle) * step
        this.incrementY = Math.sin(angle) * step
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
		Thread,
	})
})()