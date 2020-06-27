import * as d3 from 'd3'

async function start() {
  var nodeData: any = await d3.json('alesundkpi.json')
  console.log(nodeData)

  const width = 900
  const height = 900
  const radius = Math.min(width - 200, height) / 2

  function fuzy(data: any, nodata: number = 0) {
    let noData = Math.random()
    let noTarget = Math.random()
    if (data.children) {
      if ((noData < 0.1 || noTarget < 0.1) && nodata == 0) {
        if (noData < noTarget) {
          nodata = -1
          data.noData = true
        } else {
          nodata = 1
          data.noTarget = true
        }
      }
      for (const iterator of data.children) {
        fuzy(iterator, nodata)
      }
    } else if (data.value) {
      if ((noData < 0.1 || noTarget < 0.1) && nodata == 0) {
        if (noData < noTarget) {
          data.noData = true
        } else {
          data.noTarget = true
        }
        data.value = 20
      } else if (nodata != 0) {
        data.value = 20
        if (nodata < 0) data.noData = true
        if (nodata > 0) data.noTarget = true
      } else {
        let rnd = Number.parseInt((Math.random() * 100).toFixed(0))
        data.value = rnd
      }
    }
  }
  fuzy(nodeData, 0)

  var e = new Array<Range>()
  var color = d3
    .scaleThreshold<number, string>()
    .domain([32, 66, 95])
    .range(['#d17d52', '#d8ae56', '#72b282', '#459a71'])

  var colorNoValue = d3
    .scaleThreshold<number, string>()
    .domain([0])
    .range(['#89817b', '#609fba'])

  const svg = d3
    .select('svg') // Selects an element; SVG element
    .attr('width', width)
    .attr('height', height)
    .style('font', '10px sans-serif')

  const g = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // <-- 4

  const root = d3.hierarchy(nodeData).sum(function (d: any) {
    return d.value
  })
  const partition = d3.partition().size([2 * Math.PI, radius])
  partition(root)

  console.log(root)

  function nullifyNoDataFields(data: any) {
    if (data.children) {
      if (data.data.noData || data.data.noTarget) {
        data.value = 0
      }
      for (const iterator of data.children) {
        let val = nullifyNoDataFields(iterator)
        if (data.value > 0) {
          data.value -= val
        }
      }
    } else if (data.value && (data.data.noData || data.data.noTarget)) {
      let oldval = data.value
      data.value = 0
      return oldval
    }
    return 0
  }

  nullifyNoDataFields(root)

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

  g.selectAll('g')
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
    .attr('fill', (d: any) => {
      var dataCountCopy = d.copy().count()
      let parentNoData = d?.parent?.data?.noData
      let parentNoTarget = d?.parent?.data?.noTarget

      if (d.data.noData || parentNoData) {
        return colorNoValue(1)
      } else if (d.data.noTarget || parentNoTarget) {
        return colorNoValue(-1)
      }
      if (dataCountCopy.value > 1) {
        return color(d.value / dataCountCopy.value) as any
      }
      return color(d.value) as any
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

  svg
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

  svg
    .selectAll('.node')
    .append('title')
    .text((d: any) => {
      return `${d
        .ancestors()
        .map((d: any) => d.data.name)
        .reverse()
        .join('/')}\n${d.value}`
    })
}

start()
