import * as d3 from 'd3'

import { colorScaleForNoValues, colorScaleForValues } from '@helpers/Colors'
import {
	SmartCityPerformance,
	TargetAvailable,
} from '@lib/SmartCityPerformance'
import { randomizeData } from '@helpers/randomizeData'
import { style } from 'd3'
import { Legend, LegendConfig } from '@lib/Legend'

async function start() {
	var nodeData: any = await d3.json('alesundkpi.json')

	const width = window.innerWidth - 20
	const height = window.innerHeight - 20
	const radius = Math.min(width, height) / 3
	randomizeData(nodeData)

	const svg = d3
		.select('svg') // Selects an element; SVG element
		.attr('width', width)
		.attr('height', height)
		.style('font', '10px sans-serif')

	const tooltipGroup = svg.append<SVGGElement>('g')

	let tooltip = [
		{
			name: '95+ % of Target',
			score: 96,
			targetAvailable: TargetAvailable.AVAILABLE,
		},
		{
			name: '66-95 % of Target',
			score: 66,
			targetAvailable: TargetAvailable.AVAILABLE,
		},
		{
			name: '33-66 % of Target',
			score: 33,
			targetAvailable: TargetAvailable.AVAILABLE,
		},
		{
			name: 'Less than 33 % of Target',
			score: 32,
			targetAvailable: TargetAvailable.AVAILABLE,
		},
		{
			name: 'No Data or No Target',
			score: 0,
			targetAvailable: TargetAvailable.NO_TARGET,
		},
		{
			name: 'Data Reported - No targets yet available',
			score: 0,
			targetAvailable: TargetAvailable.DATA_REPORTED,
		},
	]

	let selectedScoreValue: number = -1

	tooltipGroup.call(Legend, {
		x: width - 420,
		y: 40,
		items: tooltip,
		hoverCallback: (d) => {
			console.log(d.targetAvailable)
			console.log(d.targetAvailable == TargetAvailable.AVAILABLE)

			if (d.targetAvailable || d.targetAvailable == TargetAvailable.AVAILABLE) {
				selectedScoreValue = d.score
			}
			render()
		},
	} as LegendConfig)

	const sunburstGroup = svg
		.append('g')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // <-- 4

	const root = d3
		.hierarchy<SmartCityPerformance>(nodeData)
		.sum(function (d: SmartCityPerformance) {
			return d.score ? 20 : 0
		})

	const partition = d3.partition().size([2 * Math.PI, radius])

	partition(root)

		var arc = d3
			.arc()
			.startAngle(function (d: any) {
				return d.x0
			})
			.endAngle(function (d: any) {
				return d.x1
			})
			.innerRadius(function (d: any) {
				return d.y0
			})
			.outerRadius(function (d: any) {
				if (!d.children) return d.y1 * 0.825
				return d.y1
			})

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
								return colorScaleForNoValues(d.data.targetAvailable)
							}

							return colorScaleForValues(
								Number.parseFloat(getAverageChildScores(d.data).toFixed(2))
							) as any
						})
				},
				(update) =>
					update.attr('opacity', (d: any) => {
						if (selectedScoreValue < 0) return 1

						if (d.data.targetAvailable == TargetAvailable.AVAILABLE) {
							let score = Number.parseFloat(
								getAverageChildScores(d.data).toFixed(2)
							)

							if (score > selectedScoreValue) return 1
						}

						return 0.2
					})
			)

		sunburstGroup
			.selectAll('.node')
			.attr('text-anchor', function (d: any) {
				return getTextAnchor(d)
			})
			.append('text')
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
					.join('/')}\n${Number.parseFloat(
					getAverageChildScores(d.data).toFixed(2)
				)}%`
			})
	}

	/**
	 * Computes the text rotation angle for a node.
	 * Text is flipped 180" if text is in 90-270* range
	 * @param d node to get angle of
	 */
	function getTextRotation(d: any) {
		var angle = ((d.x0 + d.x1) / Math.PI) * 90
		return angle < 180 ? angle - 90 : angle + 90
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
	 * Returns the average score of all the children scores
	 * @param node the node to get children scores of
	 */
	function getAverageChildScores(node: SmartCityPerformance): number {
		let score = 0
		if (node.targetAvailable == TargetAvailable.AVAILABLE && node.score) {
			score += node.score
		}
		if (node.children) {
			for (const child of node.children) {
				score += getAverageChildScores(child) / node.children.length
			}
		}
		return score
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
