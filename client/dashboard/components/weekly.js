import React from 'react'
import {connect} from 'react-redux'
import * as d3 from 'd3'
import DateRangePicker from './DateRangePicker'
import {fetchData} from '../../store'
import {parseDateRange, eightDaysAgo} from '../utils'

const mapStateToProps = state => {
  return {
    data: state.visualizations
  }
}

const mapDispatchToProps = {fetchData}

var datearray = []
var dataParse = data => {
  const newData = []
  for (let i = 0; i < data.length; i++) {
    let dateObject = new Date(data[i].start)
    let dailyWork = 0
    let dailyPlay = 0
    let dailyUncategorized = 0
    for (let j = 0; j < data[i].summary.length; j++) {
      dailyWork += data[i].summary[j].work / 3600000
      dailyPlay += data[i].summary[j].play / 3600000
      dailyUncategorized += data[i].summary[j].uncategorized / 3600000
    }
    newData.push({
      date: dateObject,
      work: dailyWork,
      play: dailyPlay,
      uncategorized: dailyUncategorized
    })
    // newData.push({date: dateObject, key: 'work', time: dailyWork})
    // newData.push({date: dateObject, key: 'uncategorized', time: dailyUncategorized})
    // newData.push({date: dateObject, key: 'play', time: dailyPlay})
  }
  return newData
}

var colorrange = ['#FF96A3', '#9CFEFF', '#A18CE8']

class Weekly extends React.Component {
  componentDidMount() {
    // d3.select("svg").remove()
    this.props.fetchData(eightDaysAgo(), 7, 'sumByDayBySite')

    // this.createChart(this.props.data)
  }

  // data.forEach(function(d){d.date = format.parse(d.date); };
  handleDatesRangeChange = dateRange => {
    const dates = parseDateRange(dateRange)
    console.log(...dates)
    this.props.fetchData(...dates, 'sumByDayBySite')
  }

  chart(data) {
    // const strokecolor = colorrange[0];

    const margin = {top: 20, right: 40, bottom: 30, left: 30}
    const width = document.body.clientWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'remove')
      .style('position', 'absolute')
      .style('z-index', '20')
      .style('visibility', 'hidden')
      .style('top', '330px')
      .style('left', '1150px')

    const x = d3
      .scaleTime()
      .range([0, width])
      .domain(
        d3.extent(data, function(d) {
          return d.date
        })
      )

    const y = d3
      .scaleLinear()
      .range([height - 10, 0])
      .domain([-12, 12])

    const z = d3.scaleOrdinal().range(colorrange)

    const xAxis = d3
      .axisBottom()
      .scale(x)
      .ticks(d3.timeDay) //could break code, timeWeeks?

    const yAxis = d3.axisLeft().scale(y)

    const yAxisr = d3.axisRight().scale(y)

    const stack = d3
      .stack()
      .keys(['work', 'uncategorized', 'play'])
      .offset(d3.stackOffsetSilhouette)

    var area = d3
      .area()
      .curve(d3.curveCardinal)
      .x(function(e, i) {
        return x(e.data.date)
      })
      .y0(function(e) {
        return y(e[0])
      })
      .y1(function(e) {
        return y(e[1])
      })

    var svg = d3
      .select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var layers = stack(data)

    console.log('layers', layers)
    console.log('thefuckingdata', layers[0][0].data)

    // svg.selectAll(".layer")
    //     .data(layers)
    // .enter().append("path")
    //     .attr("d", area)
    //     .style("fill", function(d, i) { return z(i); })

    var g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var layer = g
      .selectAll('.layer')
      .data(layers)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('transform', 'translate(-29, 0)')

    svg
      .selectAll('.layer')
      .attr('opacity', 1)
      .on('mouseover', function(d, i) {
        svg
          .selectAll('.layer')
          .transition()
          .duration(250)
          .attr('opacity', function(d, j) {
            return j != i ? 0.6 : 1
          })
      })
      .on('mousemove', function(d, i) {
        // gets the mouse's x position on the svg
        let mousex = d3.mouse(this)
        mousex = mousex[0]

        //converst that x position to the date associated with it
        var invertedx = x.invert(mousex)
        var xIndex = invertedx.getDay()

        //grabs the data point of the date
        var xIndexData = d[xIndex]

        //puts the date, key, and amount of time spent in a variable for the tooltip to access
        let tooltipData = []
        if (d.key === 'play') {
          tooltipData.push(invertedx, d.key, xIndexData.data.play)
        } else if (d.key === 'work') {
          tooltipData.push(invertedx, d.key, xIndexData.data.work)
        } else if (d.key === 'uncategorized') {
          tooltipData.push(invertedx, d.key, xIndexData.data.uncategorized)
        }
        let reformatDateArr = tooltipData[0].toString().split(' ')
        let reformatDateStr = reformatDateArr.slice(0, 3).join(' ')
        tooltipData[0] = reformatDateStr
        // console.log('this is tooltipData', tooltipData)

        let reformatTimeStr = tooltipData[2].toString().slice(0, 4)
        tooltipData[2] = reformatTimeStr

        tooltip
          .html(
            '<p>Date: ' +
              tooltipData[0] +
              '<br>Category: ' +
              tooltipData[1] +
              '<br>Time Spent: ' +
              tooltipData[2] +
              ' hours</p>'
          )
          .style('visibility', 'visible')

        //     d3.select(this)
        //     .classed("hover", true)
        //     .attr("stroke", strokecolor)
        //     .attr("stroke-width", "0.5px"),
        //     tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
      })
      .on('mouseout', function(d, i) {
        svg
          .selectAll('.layer')
          .transition()
          .duration(250)
          .attr('opacity', '1')
        d3
          .select(this)
          .classed('hover', false)
          .attr('stroke-width', '0px'),
          tooltip.html('<p>').style('visibility', 'hidden')
      })

    var vertical = d3
      .select('.chart')
      .append('div')
      .attr('class', 'remove')
      .style('position', 'absolute')
      .style('z-index', '19')
      .style('width', '1px')
      .style('height', '380px')
      .style('top', '10px')
      .style('bottom', '30px')
      .style('left', '0px')
      .style('background', '#fff')
      .attr('transform', 'translate(-100, -200')

    console.log('the data', data)

    layer
      .append('path')
      .attr('class', 'area')
      .style('fill', function(d, i) {
        return z(i)
      })
      .attr('d', function(e) {
        console.log('this is appends e', e)
        return area(e)
      })

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + width + ', 0)')
      .call(yAxisr)

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
  }

  render() {
    console.log('weekly data', this.props)
    // this.createChart(this.props.data)
    if (this.props.data[1].start) {
      let newData = dataParse(this.props.data)
      console.log('parsed data', dataParse(this.props.data))
      this.chart(newData)
    }
    return (
      <React.Fragment>
        <DateRangePicker handleDatesRangeChange={this.handleDatesRangeChange} />
        <svg ref={node => (this.node = node)} width={500} height={500} />
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Weekly)
