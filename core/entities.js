(() => {
    'use strict'

    function ball (position, radius, type) {
        return {
            position,
            radius,
            type,
        }
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        entities: {
            ball,
        },
    })
})()