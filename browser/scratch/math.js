(() => {
    'use strict'

    function mix (from, to, fraction) {
        return from * (1. - fraction) + to * fraction
    }

    function clamp (min, max, value) {
        return value < min ? min :
            value > max ? max :
            value
    }

    function lerp (from, to, midsteps, fun) {
        for (let i = 0; i <= midsteps; i++) {
            fun(mix(from, to, i / midsteps))
        }
    }

    Object.assign(self.sol, {
        mix,
        clamp,
        lerp,
    })
})()