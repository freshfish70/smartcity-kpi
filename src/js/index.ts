import '../scss/main.scss'

import { createSunBurst, destroySunburst } from '@lib/sunburst/sunburst'
import leaflet from 'leaflet'
import { json, select } from 'd3'
import { SmartCityPerformance } from '@lib/SmartCityPerformance'

const documentWidth = document.body.clientWidth
const documentHeight = document.body.clientHeight
const datasetPath = 'public/kpi/'
const datasetExt = '.json'

var sbc = document.getElementById('sunburst-container')

const cities = [
	{
		name: 'Ålesund',
		datasetname: 'aalesund',
		long: 62.4681226,
		lat: 6.1714094,
	},
	{
		name: 'Bergen',
		datasetname: 'bergen',
		long: 60.3652817,
		lat: 5.2890922,
	},
	{
		name: 'Trondheim',
		datasetname: 'trondheim',
		long: 63.4187959,
		lat: 10.3687237,
	},
	{
		name: 'Oslo',
		datasetname: 'oslo',
		long: 59.8939225,
		lat: 10.715078,
	},
	{
		name: 'Stavanger',
		datasetname: 'stavanger',
		long: 58.9486929,
		lat: 5.6453177,
	},
	{
		name: 'Bodø',
		datasetname: 'bodo',
		long: 67.2916,
		lat: 14.4125194,
	},
	{
		name: 'Hammerfest',
		datasetname: 'hammerfest',
		long: 70.6723928,
		lat: 23.6655613,
	},
]

var map = leaflet
	.map('leaflet-map', { maxZoom: 7, minZoom: 5, zoomSnap: 0.1, zoomDelta: 0.1 })
	.setView([65, 13], 5)

map.on('zoomanim', (e) => resizeLabels(e.zoom))

leaflet
	.tileLayer(
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
		}
	)
	.addTo(map)

for (const city of cities) {
	leaflet
		.marker([city.long, city.lat], {
			icon: leaflet.divIcon({
				iconSize: undefined,
				className: 'map-label',
				html:
					'<div><div class="map-pin"></div><span class="map-label-text">' +
					city.name +
					'</span></div>',
			}),
		})
		.on('click', async () => {
			if (sbc) {
				let data = await json<SmartCityPerformance>(
					datasetPath + city.datasetname + datasetExt
				)
				let compareData = cities
					.filter((cityToFilter) => {
						return cityToFilter.name != city.name
					})
					.map((e) => {
						return {
							name: e.name,
							dataurl: datasetPath + e.datasetname + datasetExt,
						}
					})
				await createSunBurst(data, {
					width: documentWidth,
					height: documentHeight,
					radius: Math.min(documentWidth, documentHeight) / 2,
					elementId: 'sunburst',
					rootHtmlNode: '#sunburst-container',
					name: city.name,
					compareData,
				})

				select('#sunburst-container')
					.transition()
					.duration(600)
					.style('transform', 'translate(0px,0px)')
			}
		})
		.addTo(map)
}
resizeLabels(map.getZoom())

function resizeLabels(zoomlevel: any) {
	let elements = document.getElementsByClassName('map-label-text')
	for (let index = 0; index < elements.length; index++) {
		const element = elements[index] as HTMLDivElement
		let fontSize = 20 * Math.log10(zoomlevel)
		element.style.fontSize = `${fontSize}px`
	}
}
