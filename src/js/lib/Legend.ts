import { Selection } from 'd3'
import { TargetAvailable } from './SmartCityPerformance'
import { colorScaleForValues, colorScaleForNoValues } from '@helpers/Colors'

export interface LegendConfig {
	x: number
	y: number
	height: number
	width: number
	items: Array<{
		name: string
		score: number
		targetAvailable: TargetAvailable
	}>
	hoverCallback?: (d: any) => void
	clickCallback?: (d: any) => void
}

export const Legend = (
	selection: Selection<SVGGElement, unknown, HTMLElement, any>,
	{
		x = 0,
		y = 0,
		items = [],
		height = 220,
		width = 380,
		hoverCallback,
		clickCallback,
	}: LegendConfig
) => {
	const yOffsetfactor = 32
	const textX = 40
	const colorIndicatorRadius = 10
	const cx = 20

	selection.attr('transform', `translate(${x},${y})`)
	selection
		.datum(items)
		.append('rect')
		.attr('width', width)
		.attr('height', height)
		.attr('fill', '#36435d')
		.attr('rx', 10)

	selection
		.selectAll('text')
		.data((d: any) => d)
		.join('text')
		.text((d: any) => {
			return d.name
		})
		.attr('dx', textX)
		.attr('dy', (d: any, i) => {
			return i * yOffsetfactor + yOffsetfactor
		})
		.on('mouseenter', (d) => {
			if (hoverCallback) {
				hoverCallback(d)
			}
		})
		.on('click', (d) => {
			if (clickCallback) {
				clickCallback(d)
			}
		})

	selection
		.selectAll('circle')
		.data((d: any) => d)
		.join('circle')
		.text((d: any) => {
			return d.name
		})
		.attr('fill', (d: any) => {
			return d.targetAvailable == TargetAvailable.AVAILABLE
				? colorScaleForValues(d.score)
				: colorScaleForNoValues(d.targetAvailable)
		})
		.attr('r', colorIndicatorRadius)
		.attr('cy', (d: any, i) => {
			return i * yOffsetfactor + yOffsetfactor - colorIndicatorRadius / 2
		})
		.attr('cx', cx)
}
