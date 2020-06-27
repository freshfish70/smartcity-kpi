import * as d3 from 'd3'

async function start() {
  var nodeData: any = await d3.json('alesundkpi.json')
  console.log(nodeData)

  const width = 900
  const height = 900
  const radius = Math.min(width - 200, height) / 2
  const color = d3.scaleOrdinal(d3.schemeAccent)

  const graph = d3
    .select('svg') // Selects an element; SVG element
    .attr('width', width)
    .attr('height', height)
    .style('font', '10px sans-serif')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // <-- 4

  const root = d3.hierarchy(nodeData).sum(function (d: any) {
    return d.value
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
    // .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
    // .padRadius(radius * 1.5)
    .innerRadius(function (d: any) {
      return d.y0
    })
    .outerRadius(function (d: any) {
      return d.y1
    })

  graph
    .selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
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

  function computeTextRotation(d: any) {
    var angle = ((d.x0 + d.x1) / Math.PI) * 90
    return angle < 180 ? angle - 90 : angle + 90
  }

  function computeTextPosition(d: any) {
    if (d.children) return 'middle'
    var angle = ((d.x0 + d.x1) / Math.PI) * 90
    return angle < 180 ? 'start' : 'end'
  }

  graph
    .selectAll('.node')
    .attr('text-anchor', function (d: any) {
      return computeTextPosition(d)
    })
    .append('text')
    .attr('transform', function (d: any) {
      return `translate(${arc.centroid(d)})rotate(${computeTextRotation(d)})`
    })
    .attr('dx', '0')
    .attr('dy', '.5em')
    .text((d: any) => {
      return d.parent ? d.data.name : ''
    })

  graph
    .selectAll('.node')
    .append('title')
    .text((d: any) => {
      console.log(d)

      return `${d
        .ancestors()
        .map((d: any) => d.data.name)
        .reverse()
        .join('/')}\n${d.value}`
    })
}

start()
