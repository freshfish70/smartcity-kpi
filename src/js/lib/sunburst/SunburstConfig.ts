import { Dataset } from '@lib/Dataset'

export interface SunburstConfig {
	width: number
	height: number
	radius: number
	rootHtmlNode: string
	elementId: string
	name: string
	compare?: boolean
	compareData?: Array<Dataset>
}
