/**
 * Returns the text anchor for a text element.
 * If the elements has children, return middle.
 * If not return start / end depending on the angle of the text.
 * Text from 90-270* range has anchone on end
 * @param d node to get text position on
 */
export function getTextAnchor(d: any) {
	if (d.children) return 'middle'
	var angle = ((d.x0 + d.x1) / Math.PI) * 90
	return angle < 180 ? 'start' : 'end'
}
