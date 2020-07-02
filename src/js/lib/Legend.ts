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
	hoverLeaveCallback?: (d: any) => void
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
		hoverLeaveCallback,
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

	const group = selection
		.selectAll('g')
		.data((d: any) => d)
		.join('g')
		.on('mouseenter', (d) => {
			if (hoverCallback) {
				hoverCallback(d)
			}
		})
		.on('mouseleave', (d) => {
			if (hoverLeaveCallback) {
				hoverLeaveCallback(d)
			}
		})
		.on('click', (d) => {
			if (clickCallback) {
				clickCallback(d)
			}
		})
		.attr('class', 'pointer')

	group
		.append('rect')
		.attr('fill', '#36435d')
		.attr('width', width - 20)
		.attr('height', 28)
		.attr('x', 10)
		.attr('y', (d: any, i) => {
			return i * yOffsetfactor + yOffsetfactor / 2
		})

	group
		.append('text')
		.text((d: any) => {
			return d.name
		})
		.attr('dx', textX)
		.attr('dy', (d: any, i) => {
			return i * yOffsetfactor + yOffsetfactor
		})

	group
		.append('circle')
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
