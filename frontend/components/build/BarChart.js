import * as d3 from 'd3'
import * as d3tip from 'd3-tip'

export default function (data) {
  d3.selectAll('#buildPerformanceChart > *').remove()
  let previousElem = document.querySelectorAll('.build-table-contant .accent')
  if (previousElem.length > 0) {
    previousElem[0].classList.remove('accent')
  }

  let tip = d3tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
      return `
              <span>Запрос:</span> <span style='color:#a7d2ff'>${d.label}</span><br/>
              <span>Шаг:</span> <span style='color:#a7d2ff'>${d.thread_name}</span><br/>
              <span>Сборка:</span> <span style='color:#a7d2ff'>${d.build}</span><br/>
              <span>Время:</span> <span style='color:#a7d2ff'>${d.connect_time}</span><br/>
              <span>Ошибок:</span> <span style='color:#a7d2ff'>${d.error_flag}</span>
              `
    })

  let svg = d3.select('#buildPerformanceChart')

  let margin = {top: 20, right: 20, bottom: 30, left: 60}
  let svgWidth = window.getComputedStyle(svg._groups[0][0], null).width
  let width = parseInt(svgWidth) - margin.left - margin.right
  let height = +svg.attr('height') - margin.top - margin.bottom

  svg.html(`    
    <defs>
        <rect id="rect" width="${width}" height="${height}" fill="none" />
        <clipPath id="clip">
            <use xlink:href="#rect"/>
        </clipPath>
    </defs>
    <use xlink:href="#rect"/>
`)

  let gX
  let x = d3.scaleLinear()
    .domain([1, data.length + 1])
    .range([(width / data.length), width])

  let y = d3.scaleLinear()
    .domain([0, 4000])
    .range([height, 0])

  let xAxis = d3.axisBottom(x).ticks(20)
  let yAxis = d3.axisLeft(y).ticks(20)

  let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let zoom = d3.zoom()
    .scaleExtent([1, 12])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

  function zoomed () {
    svg.selectAll('.bar-chart')
      .attr('transform', 'translate(' + d3.event.transform.x + ', 0) scale(' + d3.event.transform.k + ',1)')

    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
  }

  svg = svg
    .call(tip)
    .call(zoom)

  buildChart()
    // строим график

  function buildChart () {
    // ось x
    gX = g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    // ось y
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)

    // сетка
    g.selectAll('g.axis--y g.tick')
      .append('line')
      .classed('grid-line', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0)

    // столбцы
    g.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('g')
      .attr('class', 'bar-chart')
      .selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.thread) - (width / data.length) * 0.4 })
      .attr('y', function (d) {
        if (y(d.elapsed_time) <= 0) {
          return 0
        } else {
          return y(d.elapsed_time)
        }
      })
      .attr('width', (width / data.length) * 0.8)
      .attr('height', function (d) {
        if ((height - y(d.elapsed_time)) >= height) {
          return height
        } else {
          return height - y(d.elapsed_time)
        }
      })
      .attr('class', function (d) { return d.error_flag === 0 ? 'bar bar-ok' : 'bar bar-error' })
      .attr('data-id', function (d) { return 'thread-' + d.thread })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      // .append('title')
      // .text(function (d) { return 'Запрос: ' + d.label })

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('dx', '-4.7em')
      .attr('dy', '1em')
      .attr('fill', 'black')
      .text('Ответ мс')

    function chartBarsHandler (e) {
      let previousElem = document.querySelectorAll('.build-table-contant .accent')
      if (previousElem.length > 0) {
        previousElem[0].classList.remove('accent')
      }
      let elem = document.getElementById(e.srcElement.getAttribute('data-id'))
      elem.scrollIntoView()
      elem.classList.add('accent')
    }
    document.querySelectorAll('.bar-chart .bar').forEach(function (elem) {
      elem.addEventListener('click', chartBarsHandler, false)
    })
  }
}
