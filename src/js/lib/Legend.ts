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
	selection: Selection<HTMLElement, unknown, Element, any>,
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
	selection.datum(items)

	const group = selection
		.selectAll('li')
		.data((d: any) => d)
		.join(
			(enter) => {
				let group = enter
					.append('li')
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
					.attr('class', 'pointer legend-item')

				group
					.append('div')
					.style('background', (d: any) => d.colorValue)
					.attr('class', 'legend-bullet')

				group.append('span').text((d: any) => {
					return d.name
				})

				return group
			},
			(update) => {
				update.selectAll('*').style('opacity', (d: any) => {
					if (selectedScoreValue == d.colorValue) return 1
					if (selectedScoreValue == null) return 1
					return 0.25
				})
				return update
			}
		)
}
