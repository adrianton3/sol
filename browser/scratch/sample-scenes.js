(() => {
    'use strict'

    const header = [
        '// vec, vecFromAngle',
        '// mix, clamp, lerp, ...Math',
        '// emitters: dot, cone, line, inward, outward',
        '// entities: ball',
        '',
    ]

    const s1 = [
        ...header,
        'addEmitter(outward(vec(-150, -150), 20))',
        'addEmitter(outward(vec(150, -150), 20))',
        '',
        'addEntity(ball(vec(0, 0), 40))',
        'addEntity(ball(vec(0, 100), 40))',
        'addEntity(ball(vec(0, 200), 40))',
    ].join('\n')

    const s2 = [
        ...header,
        'const count = 11',
        'for (let i = 0; i < count; i++) {',
        '    const location = vecFromAngle(i / count * PI * 2).scale(100)',
        '    addEntity(ball(location, 10))',
        '}',
        '',
        'addEmitter(outward(vec(-150, -150), 20))',
        'addEmitter(outward(vec(150, 150), 20))',
    ].join('\n')

    Object.assign(self.sol, {
        sampleScenes: {
            s1,
            s2,
        },
    })
})()