import {
	SmartCityPerformance,
	TargetAvailable,
} from '@lib/SmartCityPerformance'

export const randomizeData = (
	data: SmartCityPerformance
): SmartCityPerformance => {
	function randomize(
		data: SmartCityPerformance,
		dataVailableForNode: TargetAvailable = TargetAvailable.AVAILABLE
	) {
		let noTarget = Math.random()
		let dataReported = Math.random()
		if (data.children) {
			if (
				(noTarget < 0.1 || dataReported < 0.1) &&
				dataVailableForNode == TargetAvailable.AVAILABLE
			) {
				if (noTarget < dataReported) {
					dataVailableForNode = data.targetAvailable = TargetAvailable.NO_TARGET
				} else {
					dataVailableForNode = data.targetAvailable =
						TargetAvailable.DATA_REPORTED
				}
			}
			if (dataVailableForNode != TargetAvailable.AVAILABLE)
				data.targetAvailable = dataVailableForNode
			for (const iterator of data.children) {
				randomize(iterator, dataVailableForNode)
			}
		} else if (data.score) {
			if (
				(noTarget < 0.1 || dataReported < 0.1) &&
				dataVailableForNode == TargetAvailable.AVAILABLE
			) {
				if (noTarget < dataReported) {
					data.targetAvailable = TargetAvailable.NO_TARGET
				} else {
					data.targetAvailable = TargetAvailable.DATA_REPORTED
				}
			} else if (dataVailableForNode != 0) {
				data.targetAvailable = dataVailableForNode
			}
			data.score = Number.parseInt((Math.random() * 100).toFixed(0))
		}
	}
	randomize(data)

	return data
}
