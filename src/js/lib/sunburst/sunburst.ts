import * as d3 from 'd3'

import { colorScaleForNoValues, colorScaleForValues } from '@helpers/Colors'
import { getTextRotation } from '@helpers/getTextRotation'
import { SmartCityPerformance, TargetAvailable } from '@lib/SmartCityPerformance'
import { randomizeData } from '@helpers/randomizeData'
import { Legend, LegendConfig } from '@lib/Legend/Legend'
import { tooltip } from '@helpers/tooltip'
import { getTextAnchor } from '@helpers/getTextAnchor'
import { HierarchyNode, partition, D3ZoomEvent, select, selectAll } from 'd3'
import { sunburstArc } from '@lib/sunburst/sunburstArc'

export interface SunburstConfig {
	width: number
	height: number
	radius: number
	rootHtmlNode: string
	elementId: string
	name: string
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

var toggle = document.getElementById('compare-toggler') as HTMLInputElement
var compareToggled = false
var selectedComparator = ''

var dimensioncompare = document.getElementById('compare-dimension') as HTMLInputElement
var subdimensioncompare = document.getElementById('compare-sub-dimension') as HTMLInputElement
var categorycompare = document.getElementById('compare-category') as HTMLInputElement

var selectedCity = document.getElementById('compare-selected-city') as HTMLInputElement

selectedCity.addEventListener('change', (e: any) => {
	console.log(e.target.value)
})

dimensioncompare.addEventListener('change', (e: any) => {
	if (e.target.checked) setSelectedComparator('dimension')
})
subdimensioncompare.addEventListener('change', (e: any) => {
	if (e.target.checked) setSelectedComparator('sub-dimension')
})
categorycompare.addEventListener('change', (e: any) => {
	if (e.target.checked) setSelectedComparator('category')
})

function setSelectedComparator(selected: string) {
	selectedComparator = selected
	console.log('selected is: ' + selectedComparator)
}

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
	elementId

	let hierarchyDataNode = d3
		.hierarchy<SmartCityPerformance>(nodeData)
		.sum(function (d: SmartCityPerformance) {
			return d.children ? 0 : 20
		})

	let partitionedRoot = partition<SmartCityPerformance>().size([2 * Math.PI, radius])(
		hierarchyDataNode
	)

	/**
	 * SVG SUNBURST SETUP
	 */
	const sunburst = d3
		.select(rootHtmlNode)
		.append('svg')
		.attr('id', elementId)
		.attr('width', 100 + '%')
		.attr('height', 100 + '%')
		.attr('preserveAspectRatio', 'xMidYMid slice')
		.attr('viewBox', '0 0 ' + width + ' ' + height + '')
		.classed('svg-content', true)

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
		.attr('id', 'node-group')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

	sunburstGroup
		.append('text')
		.attr('text-anchor', 'middle')
		.style('font', 'bold 1.2em Arial')
		.text(config.name)

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
		drawSunburst()
		drawSidebar()
	}

	function drawSunburst() {
		sunburstGroup
			.selectAll('g')
			.data(partitionedRoot.descendants())
			.join(
				function (enter) {
					return enter
						.append('g')
						.attr('class', 'node')
						.attr('class', (d: any) => {
							let nodeClass = 'node '
							if (!d.children) {
								nodeClass += 'category'
							} else if (d.parent && !d.parent.parent) {
								nodeClass += 'dimension'
							} else {
								nodeClass += 'sub-dimension'
							}
							return nodeClass
						})
						.append('path')
						.on('mouseover', (d: any) => {
							let selectedNodeClass = 'node '
							if (!d.children) {
								selectedNodeClass = 'category'
							} else if (d.parent && !d.parent.parent) {
								selectedNodeClass = 'dimension'
							} else {
								selectedNodeClass = 'sub-dimension'
							}
							selectAll('.node').attr('opacity', (e: any) => {
								let myNodeClass = 'node'
								if (!e.children) {
									myNodeClass = 'category'
								} else if (e.parent && !e.parent.parent) {
									myNodeClass = 'dimension'
								} else {
									myNodeClass = 'sub-dimension'
								}
								if (myNodeClass == selectedNodeClass) {
									return 1
								}
								return 0.2
							})
						})
						.on('mouseout', (e: any) => {
							selectAll('.node').attr('opacity', (e: any) => {
								return 1
							})
						})
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
	}

	function drawSidebar() {
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

	function removeSunburst() {
		sunburstGroup.selectAll('g').remove()
	}

	function removeLegend() {
		d3.select('#sunburst-sidebar #legend-container').remove()
	}

	let scaleTimeoutCallback: any
	globalThis.addEventListener('resize', (e) => {
		if (scaleTimeoutCallback) clearInterval(scaleTimeoutCallback)
		scaleTimeoutCallback = setTimeout(() => {
			config.width = document.body.clientWidth
			config.height = document.body.clientHeight
			config.radius = Math.min(config.width, config.height) / 2
			partitionedRoot = partition<SmartCityPerformance>().size([2 * Math.PI, config.radius])(
				hierarchyDataNode
			)
			sunburst.attr('viewBox', '0 0 ' + config.width + ' ' + config.height + '')
			removeSunburst()
			drawSunburst()
			createText()
		}, 20)
	})

	toggle?.addEventListener('change', async (e) => {
		compareToggled = !compareToggled
		const documentWidth = document.body.clientWidth
		const documentHeight = document.body.clientHeight

		const element = e.target as HTMLInputElement

		if (compareToggled) {
			var compareData: any = await d3.json('public/compare.json')
			randomizeData(compareData)
			if (selectedComparator == 'dimension') {
				let a = compareData.children
				const element = Object.assign(nodeData.children)
				for (let index = 0; index < element.length; index++) {
					let er = Object.assign({}, a[index])
					er.children = undefined
					element[index].children = er
				}

				removeSunburst()
				drawSunburst()
			} else if (selectedComparator == 'sub-dimension') {
			} else {
			}
		}
	})
	d3.selectAll('.coparator-selector').on('click', () => {})

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

	function removetext() {
		sunburstGroup.selectAll('text').remove()
	}
}

export function destroySunburst() {
	d3.select('#sunburst').remove()
	d3.select('#legend-container').remove()
}

export function destroyComparatorSunburst() {
	d3.select('#sunburst-comparator-container').remove()
	d3.select('#legend-container').remove()
}
