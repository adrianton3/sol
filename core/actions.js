(() => {
    'use strict'

    const actions = {
        'red': {
            enter (thread, entity) {
                thread.setAngle(Math.random() * Math.PI * 2.)
            },
            exit (thread) {

            },
        },

        'green': {
            enter (thread, entity) {
                thread.angle += (Math.random() * 1.5) - .75
                thread.angleIncrement = Math.random() > .5 ? .005 : -.005
                thread.angleCountdown = 420
            },
            exit (thread) {

            },
        },

        'yellow': {
            enter (thread, entity) {
                thread.setAngle(
                    Math.random() > .7 ?
                        thread.angle + Math.PI + (Math.random() * .5) - .25 :
                        thread.angle + (Math.random() * 1.5) - .75
                )
            },
            exit (thread) {

            },
        },
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        actions,
    })
})()