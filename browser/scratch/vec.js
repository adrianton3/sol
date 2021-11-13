(() => {
    'use strict'

    const vecPrototype = {
        add: function (that) {
            return vec(this.x + that.x, this.y + that.y)
        },

        sub: function (that) {
            return vec(this.x - that.x, this.y - that.y)
        },

        scale: function (value) {
            return vec(this.x * value, this.y * value)
        },

        mul: function (that) {
            return vec(this.x * that.x, this.y * that.y)
        },

        size: function () {
            return Math.sqrt(this.x ** 2 + this.y ** 2)
        },

        normalize: function () {
            const size = this.size()
            return vec(this.x / size, this.y / size)
        },

        distance: function (that) {
            return Math.sqrt((this.x - that.x) ** 2 + (this.y - that.y) ** 2)
        },

        mix: function (that, fraction) {
            return vec(this.x * (1. - fraction) + that.x * fraction, this.y * (1. - fraction) + that.y * fraction)
        },

        mid: function (that) {
            return vec((this.x + that.x) * .5, (this.y + that.y) * .5)
        },
    }

    function vec (x, y) {
        if (typeof x !== 'number' || x !== x) {
            throw new Error('vec x component must be a number')
        }

        if (typeof y !== 'number' || y !== y) {
            throw new Error('vec y component must be a number')
        }

        const instance = Object.create(vecPrototype)

        instance.x = x
        instance.y = y

        return instance
    }

    function vecFromAngle (radians) {
        return vec(Math.cos(radians), Math.sin(radians))
    }

    Object.assign(self.sol, {
        vec,
        vecFromAngle,
    })
})()