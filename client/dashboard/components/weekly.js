import React from 'react'
import {connect} from 'react-redux'
import * as d3 from 'd3'
import DateRangePicker from './DateRangePicker'
import {fetchData} from '../../store'
import {parseDateRange, eightDaysAgo} from '../utils'
import {lt} from 'semver'

const mapStateToProps = state => {
  return {
    data: state.visualizations
  }
}

const mapDispatchToProps = {fetchData}

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
  }
  return newData
}

var colorrange = ['#FF96A3', '#9CFEFF', '#A18CE8']

const legendData = [
  {color: '#A18CE8', type: 'play'},
  {color: '#FF96A3', type: 'work'}
]
class Weekly extends React.Component {
  componentDidMount() {
    this.props.fetchData(eightDaysAgo(), 7, 'sumByDayBySite')
    if (this.props.data[1] && this.props.data[1].start) {
      let newData = dataParse(this.props.data)
      this.chart(newData)
      this.legendTwo(legendData)
    }
  }

  componentDidUpdate() {
    d3.selectAll('svg').remove()
    d3.selectAll('table').remove()
    let newData = dataParse(this.props.data)
    this.chart(newData)
    this.legendTwo(legendData)
  }

  handleDatesRangeChange = dateRange => {
    const dates = parseDateRange(dateRange)
    this.props.fetchData(...dates, 'sumByDayBySite')
  }

  chart(data) {
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
      .style('top', '470px')
      .style('left', '1250px')

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

    const area = d3
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

    const svg = d3
      .select('body')
      .attr('width', width + margin.left + margin.right + 40)
      .attr('height', height + margin.top + margin.bottom)
      .append('svg')
      .attr('class', 'chart')
      .attr('width', 1400)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', 'translate(150, 150)')
      .append('g')
      .attr('transform', 'translate(80,' + margin.top + ')')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left - 12)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Hours Per Day')

    const layers = stack(data)

    const g = svg
      .append('g')
      .attr('transform', 'translate(0,' + margin.top + ')')

    const layer = g
      .selectAll('.layer')
      .data(layers)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('transform', 'translate(0, 0)')

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
        const invertedx = x.invert(mousex)
        const xIndex = invertedx.getDay()

        //grabs the data point of the date
        const xIndexData = d[xIndex]

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

  legendTwo(data) {
    const leg = {}

    // create table for the legend
    const legend = d3
      .select('body')
      .append('table')
      .style('position', 'absolute')
      .style('z-index', '990')
      .style('top', '550px')
      .style('left', '1250px')

    // create one row per segment
    const tr = legend
      .append('tbody')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr')

    // create the first column for each segment
    tr.append('td')
      .append('svg')
      .attr('width', '16')
      .attr('height', '16')
      .append('rect')
      .attr('width', '16')
      .attr('height', '16')
      .attr('fill', function(d) {
        return d.color
      })

    // create the second column for each segment
    tr.append('td').text(function(d) {
      return d.type
    })
  }

  render() {
    if (this.props.data[1] && this.props.data[1].start) {
      let newData = dataParse(this.props.data)
      this.chart(newData)
      this.legendTwo(legendData)
    }
    return (
      <React.Fragment>
        <h3 id="graphHeader">Your Browsing Behavior Over Time</h3>
        <DateRangePicker handleDatesRangeChange={this.handleDatesRangeChange} />
        <div id="dashboard" />
      </React.Fragment>
    )

    //   render() {
    //     console.log('weekly data', this.props)
    //     // this.createChart(this.props.data)
    //     if (this.props.data[1].start) {
    //       let newData = dataParse(this.props.data)
    //       console.log('parsed data', dataParse(this.props.data))
    //       this.chart(newData)
    //     }
    //     return (
    //       <React.Fragment>
    //         <DateRangePicker handleDatesRangeChange={this.handleDatesRangeChange} />
    //         <svg ref={node => (this.node = node)} width={500} height={500} />
    //       </React.Fragment>
    //     )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Weekly)
