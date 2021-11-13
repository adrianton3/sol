(() => {
    'use strict'

    function isValidSource (source) {
        try {
            Function(source)
            return true
        } catch (ex) {
            return false
        }
    }

    function scenesAreEqual (a, b) {
        if ((a == null && b != null) || (a != null && b == null)) {
            return false
        }

        if (
            a.size.width !== b.size.width ||
            a.size.height !== b.size.height
        ) {
            return false
        }

        if (a.emitters.length !== b.emitters.length) {
            return false
        }

        if (a.entities.length !== b.entities.length) {
            return false
        }

        return JSON.stringify(a.entities) === JSON.stringify(b.entities) &&
            JSON.stringify(a.emitters) === JSON.stringify(b.emitters)
    }

    Object.assign(self.sol, {
        isValidSource,
        scenesAreEqual,
    })
})()