import * as d3 from 'd3'

export default function (data, project, action, jobSelf) {
  d3.selectAll('#jobsPerformanceChart > *').remove()
  let parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')

  if (action !== 'redraw') {
    data.forEach(function (d) {
      d.time_stamp = parseTime(d.time_stamp)
    })
  }

  // локализация дат

  let locale = d3.timeFormatLocale({
    'dateTime': '%A, %e %B %Y г. %X',
    'date': '%d.%m.%Y',
    'time': '%H:%M:%S',
    'periods': ['AM', 'PM'],
    'days': ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    'shortDays': ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    'months': ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    'shortMonths': ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  })

  let formatMillisecond = locale.format('.%L')
  let formatSecond = locale.format(':%S')
  let formatMinute = locale.format('%I:%M')
  let formatHour = locale.format('%I %p')
  let formatDay = locale.format('%a %d')
  let formatWeek = locale.format('%b %d')
  let formatMonth = locale.format('%B')
  let formatYear = locale.format('%Y')

  function multiFormat (date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
          : d3.timeDay(date) < date ? formatHour
            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
              : d3.timeYear(date) < date ? formatMonth
                : formatYear)(date)
  }
  let margin = {top: 20, right: 50, bottom: 20, left: 80}

  let svg = d3.select('#jobsPerformanceChart')

  let svgWidth = window.getComputedStyle(svg._groups[0][0], null).width
  let width = parseInt(svgWidth) - margin.left - margin.right
  let height = +svg.attr('height') - margin.top - margin.bottom

  svg.html(`    
    <defs>
        <rect id="rect2" width="${width}" height="${height}" fill="none" />
        <clipPath id="clip2">
            <use xlink:href="#rect2"/>
        </clipPath>
    </defs>
    <use xlink:href="#rect2"/>
`)

  let zoom = d3.zoom()
    .scaleExtent([1, 10])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed)

  function zoomed () {
    svg.selectAll('.charts')
      .attr('transform', d3.event.transform)

    svg.selectAll('.dot')
      .attr('transform', d3.event.transform)

    d3.selectAll('.line').style('stroke-width', 2 / d3.event.transform.k)
    d3.selectAll('.dot').attr('r', (5 / d3.event.transform.k))

    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)))

    // сетка
    gY.selectAll('g.axis--y g.tick')
      .append('line')
      .classed('grid-line', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0)
  }

  svg = svg
    .call(zoom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let x = d3.scaleTime()
    .domain([
      new Date(data[0].time_stamp),
      new Date(data[data.length - 1].time_stamp)
    ])
    .range([0, width])
  let y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.elapsed_time })])
    .range([height, 0])

  let xAxis = d3.axisBottom(x).tickFormat(multiFormat)
  let yAxis = d3.axisLeft(y).ticks(20)

  let line = d3.line()
    .x(function (d) { return x(d.time_stamp) })
    .y(function (d) { return y(d.elapsed_time) })

  let chartArea = svg.append('g')
    .attr('clip-path', 'url(#clip2)')

  // линия
  chartArea.append('g')
    .attr('class', 'charts')
    .append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', function (d) { return line(d) })

  // точки
  chartArea.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot chart-link')
    .attr('data-id', function (d) { return d._id })
    .attr('r', 5)
    .attr('cx', function (d) { return x(d.time_stamp) })
    .attr('cy', function (d) { return y(d.elapsed_time) })

  // ось x
  let gX = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  // ось y
  let gY = svg.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis)

  // сетка
  gY.selectAll('g.axis--y g.tick')
    .append('line')
    .classed('grid-line', true)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', width)
    .attr('y2', 0)

  gY.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('dy', '1em')
    .attr('fill', 'black')
    .text('Ответ мс')

  // ссылки на точках
  function chartCircleHandler (e) {
    console.log(e)
    jobSelf.$router.push('/job/' + jobSelf.$route.params.name + '/' + e.srcElement.getAttribute('data-id'))
  }
  document.querySelectorAll('.chart-link').forEach(function (elem) {
    elem.addEventListener('click', chartCircleHandler, false)
  })
}
