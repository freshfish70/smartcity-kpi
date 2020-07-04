import '../scss/main.scss'

import { createSunBurst, destroySunburst } from '@lib/sunburst/sunburst'

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
