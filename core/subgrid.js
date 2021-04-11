(() => {
    'use strict'

    function Subgrid (size) {
        this.size = size

        this.shift = Math.ceil(Math.log2(size.width))

        this.sizePot = {
            width: 1 << this.shift,
            height: size.height,
        }

        this.grid = new Float64Array(this.sizePot.width * this.sizePot.height)
    }

    Subgrid.prototype.add = function (x, y, value) {
        const topX = Math.floor(x)
        const topY = Math.floor(y)

        const fracX = x - topX
        const fracY = y - topY

        this.grid[( topY      << this.shift) + topX    ] += value * (1 - fracX) * (1 - fracY)
        this.grid[( topY      << this.shift) + topX + 1] += value *      fracX  * (1 - fracY)
        this.grid[((topY + 1) << this.shift) + topX    ] += value * (1 - fracX) *      fracY
        this.grid[((topY + 1) << this.shift) + topX + 1] += value *      fracX  *      fracY
    }

    Object.assign(typeof module === 'undefined' ? self.sol : module.exports, {
        Subgrid,
    })
})()