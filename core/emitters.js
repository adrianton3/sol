(() => {
    'use strict'

    const { Thread } = typeof module === 'undefined' ? self.sol : require('./thread')

    function dot (position) {
        return {
            type: 'dot',
            position,
        }
    }

    function cone (position, angle, span) {
        return {
            type: 'cone',
            position,
            angle,
            span,
        }
    }

    function line (position, angle, radius) {
        return {
            type: 'line',
            position,
            angle,
            radius,
        }
    }

    function inward (position, radius) {
        return {
            type: 'inward',
            position,
            radius,
        }
    }

    function outward (position, radius) {
        return {
            type: 'outward',
            position,
            radius,
        }
    }

    function random (start, end) {
        return Math.random() * (end - start) + start
    }

    const emitters = {
        'dot': (emitter) => {
            return new Thread(
                emitter.position.x,
                emitter.position.y,
                random(0, Math.PI * 2),
            )
        },

        'cone': (emitter) => {
            return new Thread(
                emitter.position.x,
                emitter.position.y,
                emitter.angle + random(-span, span),
            )
        },

        'line': (emitter) => {
            const radius = random(-emitter.radius, emitter.radius)

            return new Thread(
                emitter.position.x + Math.cos(emitter.angle + Math.PI * .5) * radius,
                emitter.position.y + Math.sin(emitter.angle + Math.PI * .5) * radius,
                emitter.angle,
            )
        },

        'inward': (emitter) => {
            const angle = random(0, Math.PI * 2)

            return new Thread(
                emitter.position.x + Math.cos(angle) * emitter.radius,
                emitter.position.y + Math.sin(angle) * emitter.radius,
                angle + Math.PI,
            )
        },

        'outward': (emitter) => {
            const angle = random(0, Math.PI * 2)

            return new Thread(
                emitter.position.x + Math.cos(angle) * emitter.radius,
                emitter.position.y + Math.sin(angle) * emitter.radius,
                angle,
            )
        },
    }

    function emit (emitter, count) {
        const makeThread = emitters[emitter.type]

        const threads = []

        for (let i = 0; i < count; i++) {
            threads.push(makeThread(emitter))
        }

        return threads
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        emitters: {
            dot,
            cone,
            line,
            inward,
            outward,
            emit,
        },
    })
})()