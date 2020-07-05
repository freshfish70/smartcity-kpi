import * as d3 from 'd3'

import { colorScaleForNoValues, colorScaleForValues } from '@helpers/Colors'
import { getTextRotation } from '@helpers/getTextRotation'
import { SmartCityPerformance, TargetAvailable } from '@lib/SmartCityPerformance'
import { randomizeData } from '@helpers/randomizeData'
import { Legend, LegendConfig } from '@lib/Legend/Legend'
import { tooltip } from '@helpers/tooltip'
import { getTextAnchor } from '@helpers/getTextAnchor'
import { HierarchyNode, partition, D3ZoomEvent } from 'd3'
import { sunburstArc } from '@lib/sunburst/sunburstArc'

export interface SunburstConfig {
	width: number
	height: number
	radius: number
	rootHtmlNode: string
	elementId: string
}

var toggle = document.getElementById('label-toggler') as HTMLInputElement
toggle?.addEventListener('change', (e) => {
	const element = e.target as HTMLInputElement
	d3.selectAll('.node-label')
		.transition()
		.duration(200)
		.style('opacity', (d: any) => {
			if (!d.children && !element.checked) return 0
			return 1
		})
})

var close = document.getElementById('sunburst-close')
close?.addEventListener('click', (e) => {
	d3.select('#sunburst-container')
		.transition()
		.duration(350)
		.style('transform', 'translate(100vw,0px)')
		.call(destroySunburst)
	toggle.checked = false
})

export async function createSunBurst(config: SunburstConfig) {
	const { width, height, radius, rootHtmlNode = 'body', elementId } = config

	var nodeData: any = await d3.json('public/alesundkpi.json')
	randomizeData(nodeData)

	/**
	 * DATA SETUP
	 */

	const hierarchyDataNode = d3
		.hierarchy<SmartCityPerformance>(nodeData)
		.sum(function (d: SmartCityPerformance) {
			return d.children ? 0 : 20
		})

	const partitionedRoot = partition<SmartCityPerformance>().size([2 * Math.PI, radius])(
		hierarchyDataNode
	)

	/**
	 * SVG SUNBURST SETUP
	 */
	const sunburst = d3
		.select(rootHtmlNode)
		.append('svg')
		.attr('id', elementId)
		.attr('width', width)
		.attr('height', height)

	var zoom: any = d3
		.zoom()
		.scaleExtent([0, 8])
		.on('zoom', function () {
			sunburst.select('g').attr('transform', () => {
				const { x, y, k } = (d3.event as D3ZoomEvent<Element, unknown>).transform
				return `translate(${width / 2 + x}, ${height / 2 + y}) scale(${k <= 0.5 ? 0.5 : k})`
			})
		})

	sunburst.call(zoom)

	const sunburstGroup = sunburst
		.append('g')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

	sunburstGroup
		.append('text')
		.attr('text-anchor', 'middle')
		.style('font', 'bold 1.2em Arial')
		.text(partitionedRoot.ancestors()[0].data.name)

	/**
	 * SIDEBAR SETUP
	 */
	const sidebar = d3.select('#sunburst-sidebar').append('div').attr('id', 'legend-container')
	const legend = sidebar.insert<HTMLElement>('ul', ':first-child').attr('class', 'legend')
	sidebar.insert('h3', ':first-child').text(hierarchyDataNode.ancestors()[0].data.name + ' KPI')
	sidebar.insert('span', '.legend').text('Click a label for filtering').attr('class', 'is-italic')

	let selectedScoreValue: string | null = null

	const isTargetAvailable = (node: HierarchyNode<SmartCityPerformance>) =>
		node.data.targetAvailable == TargetAvailable.AVAILABLE
	const getTargetAvailable = (node: HierarchyNode<SmartCityPerformance>) =>
		node.data.targetAvailable

	render()
	createText()

	function render() {
		sunburstGroup
			.selectAll('g')
			.data(partitionedRoot.descendants())
			.join(
				function (enter) {
					return enter
						.append('g')
						.attr('class', 'node')
						.append('path')
						.attr('display', function (d) {
							return d.depth ? null : 'none'
						})
						.attr('d', sunburstArc)
						.style('stroke', '#fff')
						.attr('fill', (d) => {
							if (isTargetAvailable(d)) {
								return colorScaleForValues(d.data.score ? d.data.score : 0) as any
							}
							let color = colorScaleForNoValues(getTargetAvailable(d))
							return color
						})
				},
				function (update) {
					update
						.transition()
						.duration(200)
						.attr('opacity', (d) => {
							if (selectedScoreValue == null) return 1
							const targetAvailable = isTargetAvailable(d)
							if (
								targetAvailable &&
								selectedScoreValue == colorScaleForValues(d.data.score ? d.data.score : 0)
							) {
								return 1
							} else if (
								!targetAvailable &&
								selectedScoreValue == colorScaleForNoValues(d.data.targetAvailable)
							) {
								return 1
							}

							return 0.2
						})
					return update
				}
			)

		legend.call(Legend, {
			x: width - 420,
			y: 40,
			items: tooltip,
			selectedScoreValue: selectedScoreValue,
			clickCallback: (d) => {
				if (d.colorValue === selectedScoreValue) selectedScoreValue = null
				else selectedScoreValue = d.colorValue
				render()
			}
		} as LegendConfig)
	}

	function createText() {
		sunburstGroup
			.selectAll('.node')
			.attr('text-anchor', (d: unknown) => {
				return getTextAnchor(d)
			})
			.append('text')
			.attr('class', 'node-label')
			.attr('transform', function (d: any) {
				return `translate(${sunburstArc.centroid(d)})rotate(${getTextRotation(d)})`
			})
			.attr('dx', (d: any) => {
				if (!d.children) return (getTextRotation(d) < 180 ? radius : -radius) * 0.065
				return 0
			})
			.attr('dy', '.5em')
			.text((d: any) => {
				return d.parent ? d.data.name : ''
			})
			.style('fill', '#fff')
			.style('opacity', (d: any) => {
				if (!d.children) return 0
				return 1
			})
			.style('font-weight', '400')

		sunburstGroup
			.selectAll('.node')
			.append('title')
			.text((d: any) => {
				return `${d
					.ancestors()
					.map((d: any) => {
						return d.data.name
					})
					.reverse()
					.join('/')}\n${isTargetAvailable(d) ? d.data.score.toFixed(2) : 0}%`
			})
	}
}

export function destroySunburst() {
	d3.select('#sunburst').remove()
	d3.select('#sunburst-sidebar #legend-container').remove()
}
