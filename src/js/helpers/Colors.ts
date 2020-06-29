import { scaleThreshold, scaleIdentity } from 'd3'

const colorsForValues = ['#d17d52', '#d8ae56', '#72b282', '#459a71']
const colorsForNoValues = ['#89817b', '#609fba']

const domainForValues = [32, 66, 95]
const domainForNoValues = [0]

const colorScaleForValues = scaleThreshold<number, string>()
	.domain(domainForValues)
	.range(colorsForValues)

const colorScaleForNoValues = scaleThreshold<number, string>()
	.domain(domainForNoValues)
	.range(colorsForNoValues)

export { colorScaleForNoValues, colorScaleForValues }
