import { Selection } from 'd3'
import { Tooltip } from './Tootip'

export interface LegendConfig {
	x: number
	y: number
	height: number
	width: number
	selectedScoreValue: string | null
	items: Array<Tooltip>
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
		selectedScoreValue,
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

	var bg = selection
		.selectAll('rect')
		.data([null])
		.join('rect')
		.attr('width', width)
		.attr('height', height)
		.attr('fill', '#36435d')
		.attr('rx', 10)

	selection.datum(items)

	const group = selection
		.selectAll('g')
		.data((d: any) => d)
		.join(
			(enter) => {
				let group = enter
					.append('g')
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
					.attr('fill', (d: any) => d.colorValue)
					.attr('r', colorIndicatorRadius)
					.attr('cy', (d: any, i) => {
						return i * yOffsetfactor + yOffsetfactor - colorIndicatorRadius / 2
					})
					.attr('cx', cx)
				return group
			},
			(update) => {
				update.selectAll('g *').style('opacity', (d: any) => {
					if (selectedScoreValue == d.colorValue) return 1
					if (selectedScoreValue == null) return 1
					return 0.25
				})
				return update
			}
		)
}
