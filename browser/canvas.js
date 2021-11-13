(() => {
	'use strict'

	function makeCanvas (canvas, size, shape) {
		canvas.width = size.width
		canvas.height = size.height

		if (shape === 'circle') {
			canvas.style.borderRadius = `${Math.min(size.width, size.height)}px`
		}

		const context = canvas.getContext('2d')

		{
			const imageData = context.createImageData(canvas.width, canvas.height)

			for (let i = 0; i < imageData.data.length; i += 4) {
				imageData.data[i + 0] = 0
				imageData.data[i + 1] = 0
				imageData.data[i + 2] = 0
				imageData.data[i + 3] = 255
			}

			context.putImageData(imageData, 0, 0)
		}

		return {
			drawSubgrid (subgrid, multiplier) {
				const imageData = context.createImageData(subgrid.sizePot.width, subgrid.sizePot.height)

				for (let i = 0, p = 0; i < subgrid.grid.length; i++, p += 4) {
					const value = subgrid.grid[i]

					imageData.data[p + 0] = value * multiplier
					imageData.data[p + 1] = value * multiplier
					imageData.data[p + 2] = value * multiplier
					imageData.data[p + 3] = 255
				}

				context.putImageData(imageData, 0, 0)
			},
		}
	}

	Object.assign(self.sol, {
		makeCanvas,
    })
})()
