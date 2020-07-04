import '../scss/main.scss'

import { createSunBurst, destroySunburst } from '@lib/sunburst/sunburst'
import leaflet from 'leaflet'

const documentWidth = window.innerWidth - 310
const documentHeight = window.innerHeight

var to = document.getElementById('show')
var sbc = document.getElementById('sunburst-container')

if (sbc) sbc.hidden = true
to?.addEventListener('click', async () => {
	if (sbc) {
		if (sbc.hidden) {
			await createSunBurst({
				width: documentWidth,
				height: documentHeight,
				radius: Math.min(documentWidth, documentHeight) / 3,
				elementId: 'sunburst',
				rootHtmlNode: '#sunburst-container'
			})
			sbc.hidden = false
		} else {
			sbc.hidden = true
			destroySunburst()
		}
	}
})

const cities = [
	{
		name: 'Ålesund',
		long: 62.4681226,
		lat: 6.1714094
	},
	{
		name: 'Bergen',
		long: 60.3652817,
		lat: 5.2890922
	},
	{
		name: 'Trondheim',
		long: 63.4187959,
		lat: 10.3687237
	},
	{
		name: 'Oslo',
		long: 59.8939225,
		lat: 10.715078
	},
	{
		name: 'Stavanger',
		long: 58.9486929,
		lat: 5.6453177
	},
	{
		name: 'Bodø',
		long: 67.2916,
		lat: 14.4125194
	},
	{
		name: 'Hammerfest',
		long: 70.6723928,
		lat: 23.6655613
	}
]

var map = leaflet.map('leaflet-map', { maxZoom: 7 }).setView([61.14, 9.25], 7)
leaflet
	.tileLayer(
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
		}
	)
	.addTo(map)

for (const city of cities) {
	leaflet
		.circle([city.long, city.lat], {
			color: 'steelblue',
			radius: 7000
		})
		.addTo(map)

	leaflet
		.marker([city.long, city.lat], {
			icon: leaflet.divIcon({
				className: 'map-label',
				html: city.name
			})
		})
		.addTo(map)
}
