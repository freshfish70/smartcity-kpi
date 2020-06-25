import * as d3 from 'd3'

var nodeData = {
  name: 'TOPICS',
  children: [
    {
      name: 'Topic A',
      children: [
        { name: 'Sub A1', size: 4 },
        { name: 'Sub A2', size: 4 },
      ],
    },
    {
      name: 'Topic B',
      children: [
        { name: 'Sub B1', size: 3 },
        { name: 'Sub B2', size: 3 },
        {
          name: 'Sub B3',
          size: 10,
        },
      ],
    },
    {
      name: 'Topic C',
      children: [
        { name: 'Sub A1', size: 4 },
        { name: 'Sub A2', size: 4 },
      ],
    },
  ],
}

const width = 500
const height = 500
const radius = Math.min(width, height) / 2
const color = d3.scaleOrdinal(d3.schemeAccent)

const graph = d3
  .select('svg') // Selects an element; SVG element
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // <-- 4

// Creates a structure for organising the data, so each slice in the sunburst
// is sized relative to other slices.
// The size, sets the total size of the structure, now a circle of R radius.
const partition = d3.partition().size([2 * Math.PI, radius])

const root = d3.hierarchy(nodeData).sum(function (d: any) {
  return d.size
})

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
    return d.y1
  })

graph
  .selectAll('path')
  .data(root.descendants())
  .enter()
  .append('path')
  .attr('display', function (d) {
    return d.depth ? null : 'none'
  })
  .attr('d', arc as any)
  .style('stroke', '#fff')
  .style('fill', function (d) {
    if (d.children) return color(d.data.name)
    if (d.parent) return color(d.parent.data.name)
    return 0
  })
