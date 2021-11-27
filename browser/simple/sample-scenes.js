(() => {
    'use strict'

    const s1 = {
        size: {
            width: 512,
            height: 512,
        },
        shape: 'circle',
        body: [
            'const count = 19',
            'const radius = 120',

            'const slice = (PI * 2) / count',

            'for (let i = 0; i < count; i++) {',
            '   const angle = slice * i + slice * time',
            '   addEntity(ball(vecFromAngle(angle).scale(radius), 10))',
            '}',

            'addEmitter(outward(vec(50, 0), 20))',
        ].join('\n'),
    }

    Object.assign(window.sol, {
        sampleScenes: {
            s1,
        },
    })
})()
