import { HierarchyRectangularNode, arc } from 'd3'

export const sunburstArc = (scale = false) => {
	return arc<HierarchyRectangularNode<any>>()
		.startAngle(function (d) {
			return d.x0
		})
		.endAngle(function (d) {
			return d.x1
		})
		.innerRadius(function (d) {
			if (scale) {
				if (!d.children) return d.y0 * 1.1
				if (d.ancestors().length == 3) return d.y0 * 0.8
			}
			return d.y0
		})
		.outerRadius(function (d) {
			if (scale) {
				if (!d.children) return d.y1 * 0.9
				if (d.ancestors().length == 2) return d.y1 * 0.8
				if (d.ancestors().length == 3) return d.y1 * 1.1
			}
			return d.y1
		})
}
