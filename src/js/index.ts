import * as d3 from 'd3'

import { colorScaleForNoValues, colorScaleForValues } from '@helpers/Colors'
import { getTextRotation } from '@helpers/getTextRotation'
import {
	SmartCityPerformance,
	TargetAvailable,
} from '@lib/SmartCityPerformance'
import { randomizeData } from '@helpers/randomizeData'
import { Legend, LegendConfig } from '@lib/Legend'
import { tooltip } from '@helpers/tooltip'

async function start() {
	var nodeData: any = await d3.json('alesundkpi.json')

	var toggle = document.getElementById('toggle')
	toggle?.addEventListener('change', (e) => {
		const element = e.target as HTMLInputElement
		sunburstGroup
			.selectAll('.node-label')
			.transition()
			.duration(200)
			.style('opacity', (d: any) => {
				if (!d.children && !element.checked) return 0
				return 1
			})
	})

	const width = window.innerWidth
	const height = window.innerHeight
	const radius = Math.min(width, height) / 3
	randomizeData(nodeData)

	const svg = d3
		.select('svg') // Selects an element; SVG element
		.attr('width', width)
		.attr('height', height)
		.style('font', '.8rem arial')

	const tooltipGroup = svg.append<SVGGElement>('g')

	let selectedScoreValue: string | null = null

	tooltipGroup.call(Legend, {
		x: width - 420,
		y: 40,
		items: tooltip,
		hoverCallback: (d) => {
			selectedScoreValue = d.colorValue
			render()
		},
		hoverLeaveCallback: (d) => {
			selectedScoreValue = null
			setTimeout(() => {
				if (!selectedScoreValue) render()
			}, 250)
		},
	} as LegendConfig)

	const sunburstGroup = svg
		.append('g')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // <-- 4

	const root = d3
		.hierarchy<SmartCityPerformance>(nodeData)
		.sum(function (d: SmartCityPerformance) {
			return d.children ? 0 : 20
		})

	const partition = d3.partition().size([2 * Math.PI, radius])

	partition(root)

	sunburstGroup
		.append('text')
		.attr('text-anchor', 'middle')
		.style('font', 'bold 1.2rem arial')
		.text(root.ancestors()[0].data.name)

	var arc = d3
		.arc()
		.startAngle(function (d: any) {
			return d.x0
		})
		.endAngle(function (d: any) {
			return d.x1
		})
		.innerRadius(function (d: any) {
			if (!d.children) return d.y0 * 1.1
			if (d.ancestors().length == 3) return d.y0 * 0.8
			return d.y0
		})
		.outerRadius(function (d: any) {
			if (!d.children) return d.y1 * 0.9
			if (d.ancestors().length == 2) return d.y1 * 0.8
			if (d.ancestors().length == 3) return d.y1 * 1.1
			return d.y1
		})

	render()
	createText()

	function render() {
		sunburstGroup
			.selectAll('g')
			.data(root.descendants())
			.join(
				function (enter) {
					return enter
						.append('g')
						.attr('class', 'node')
						.append('path')
						.attr('display', function (d) {
							return d.depth ? null : 'none'
						})
						.attr('d', arc as any)
						.style('stroke', '#fff')
						.attr('fill', (d: any) => {
							if (
								d.data.targetAvailable == TargetAvailable.NO_TARGET ||
								d.data.targetAvailable == TargetAvailable.DATA_REPORTED
							) {
								let color = colorScaleForNoValues(d.data.targetAvailable)
								return color
							}
							return colorScaleForValues(d.data.score) as any
						})
				},
				function (update: any) {
					return update
						.transition()
						.duration(200)
						.attr('opacity', (d: any) => {
							if (selectedScoreValue == null) return 1

							if (
								d.data.targetAvailable == TargetAvailable.AVAILABLE &&
								selectedScoreValue == colorScaleForValues(d.data.score)
							) {
								return 1
							} else if (
								d.data.targetAvailable != TargetAvailable.AVAILABLE &&
								selectedScoreValue ==
									colorScaleForNoValues(d.data.targetAvailable)
							) {
								return 1
							}

							return 0.2
						})
				}
			)
	}

	function createText() {
		sunburstGroup
			.selectAll('.node')
			.attr('text-anchor', function (d: any) {
				return getTextAnchor(d)
			})
			.append('text')
			.attr('class', 'node-label')
			.attr('transform', function (d: any) {
				return `translate(${arc.centroid(d)})rotate(${getTextRotation(d)})`
			})
			.attr('dx', (d: any) => {
				if (!d.children)
					return (getTextRotation(d) < 180 ? radius : -radius) * 0.065
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
			.style('font', 'bold .6rem arial')

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
					.join('/')}\n${
					d.data.targetAvailable == TargetAvailable.AVAILABLE
						? d.data.score.toFixed(2)
						: 0
				}%`
			})
	}

	/**
	 * Returns the text anchor for a text element.
	 * If the elements has children, return middle.
	 * If not return start / end depending on the angle of the text.
	 * Text from 90-270* range has anchone on end
	 * @param d node to get text position on
	 */
	function getTextAnchor(d: any) {
		if (d.children) return 'middle'
		var angle = ((d.x0 + d.x1) / Math.PI) * 90
		return angle < 180 ? 'start' : 'end'
	}

	/**
	 * Returns the sum of all the children a node has
	 * @param node the node to get child count of
	 */
	function countAllChildren(node: SmartCityPerformance): number {
		let sum = 0
		if (node.children) {
			sum += node.children.length
			for (const child of node.children) {
				sum += countAllChildren(child)
			}
		}
		return sum
	}
}

start()
