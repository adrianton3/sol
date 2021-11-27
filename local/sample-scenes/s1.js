({
    size: {
        width: 512,
        height: 512,
    },
    shape: 'rectangle',
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
})
