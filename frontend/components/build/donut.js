import * as d3 from 'd3'

export default function (data) {
  d3.selectAll('#donutChart > *').remove()
  d3.selectAll('#donutLegend > *').remove()

  const reducer = (accumulator, currentValue) => accumulator + currentValue.error_flag
  let errorCount = data.reduce(reducer, 0)
  let buildsCount = data.length
  let errorSummary = [
    {name: 'errors', value: errorCount, color: 'brown', label: 'Ошибок: '},
    {name: 'success', value: buildsCount - errorCount, color: 'steelblue', label: 'Успешно: '}
  ]

  let svg = d3.select('#donutChart')
  let legend = d3.select('#donutLegend')
    .attr('height', (errorSummary.length) * 20)
    .selectAll('g')
    .data(errorSummary)
    .enter().append('g')
    .attr('transform', function (d, i) { return 'translate(0,' + i * 20 + ')' })

  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', function (d) { return d.color })

  legend.append('text')
    .attr('x', 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .text(function (d) { return d.label + d.value })

  let margin = {top: 0, right: 10, bottom: 0, left: 10}
  let svgWidth = window.getComputedStyle(svg._groups[0][0], null).width
  let width = parseInt(svgWidth) - margin.left - margin.right
  let height = +svg.attr('height') - margin.top - margin.bottom

  svg = svg.append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  svg.append('text')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text(`Ошибок: ${errorCount}`)

  let radius = Math.min(width, height) / 2

  let arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius * 0.8)

  let pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.value })

  let g = svg.selectAll('.arc')
      .data(pie(errorSummary))
      .enter().append('g')
      .attr('class', 'arc')
    .style('fill', function (d) { return d.data.color })

  g.append('path')
      .attr('d', arc)

  g.append('text')
      .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')' })
      .attr('dy', '.35em')
      .text(function (d) { return d.name })
}
