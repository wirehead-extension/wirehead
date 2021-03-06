import React from 'react'
import {connect} from 'react-redux'
import {fetchData} from '../../store'
import {withRouter} from 'react-router-dom'
import {humanTime} from '../utils'
import {DatePicker} from './'
import {Container, Header} from 'semantic-ui-react'
import {
  scaleBand,
  scaleLinear,
  axisBottom,
  arc,
  pie,
  interpolate,
  selectAll,
  select,
  format,
  sum,
  max
} from 'd3'

class Daily extends React.Component {
  constructor() {
    super()
    this.createDashboard = this.createDashboard.bind(this)
  }

  handleDateChange = date => {
    this.props.fetchData(new Date(date), 1, 'sumBySite')
  }

  componentDidMount() {
    selectAll('svg').remove()
    selectAll('table').remove()
    this.props
      .fetchData(new Date().setHours(0, 0, 0, 0).valueOf(), 1, 'sumBySite')
      .then(this.createDashboard('#subDiv', this.props.data))
  }

  componentDidUpdate() {
    selectAll('svg').remove()
    selectAll('table').remove()
    this.createDashboard('#subDiv', this.props.data)
  }

  componentWillUnmount() {
    this.removeDashboard('svg')
    this.removeDashboard('table')
  }

  removeDashboard(className) {
    selectAll(className).remove()
  }

  createDashboard(id, data) {
    let topFiveTotal = []
    let topFivePlay = []
    let topFiveWork = []
    let totalWork = {}
    let totalPlay = {}

    const findTopFiveTotal = dataSet => {
      let sortedArr = dataSet.sort(function(a, b) {
        return (
          b.work + b.play + b.uncategorized - a.work - a.play - a.uncategorized
        )
      })
      return sortedArr.slice(0, 5)
    }
    const findTopFivePlay = dataSet => {
      let playArr = dataSet.filter(e => e.play)
      return playArr
        .sort(function(a, b) {
          return b.play - a.play
        })
        .slice(0, 5)
    }
    const findTopFiveWork = dataSet => {
      let workArr = dataSet.filter(e => e.work)
      return workArr
        .sort(function(a, b) {
          return b.work - a.work
        })
        .slice(0, 5)
    }

    const findTotalWork = dataSet =>
      dataSet.reduce((acc, cur) => (cur.work ? acc + cur.work : acc), 0)

    const findTotalPlay = dataSet =>
      dataSet.reduce((acc, cur) => (cur.play ? acc + cur.play : acc), 0)

    const findTotalUncategorized = dataSet =>
      dataSet.reduce(
        (acc, cur) => (cur.uncategorized ? acc + cur.uncategorized : acc),
        0
      )

    topFiveTotal = findTopFiveTotal(this.props.data)
    topFivePlay = findTopFivePlay(this.props.data)
    topFiveWork = findTopFiveWork(this.props.data)
    totalWork = findTotalWork(this.props.data)
    totalPlay = findTotalPlay(this.props.data)

    const barColor = 'steelblue'
    function segColor(c) {
      return {work: '#807dba', play: '#e08214'}[c]
    }

    let tF = ['play', 'work'].map(function(d) {
      return {
        type: d,
        time: sum(
          data.map(function(t) {
            if (t[d]) {
              return t[d]
            }
          })
        )
      }
    })

    let sF = topFiveTotal.map(function(d) {
      return [d.url, d.play + d.work]
    })

    const hG = histoGram(sF), // create the histogram.
      pC = pieChart(tF), // create the pie-chart.
      leg = legend(tF) // create the legend.

    // d3.select(id)
    //   .append('div')
    //   .attr('id', 'dailydiv')
    // .style('position', 'relative')
    // .style('left', '165px')
    // .style('top', '400px')
    // .style('width', '2000px')

    // function to create histogram
    function histoGram(fD) {
      // console.log('this is fd', fD)
      let hG = {},
        hGDim = {t: 60, r: 0, b: 10, l: 0}
      hGDim.w = 600 - hGDim.l - hGDim.r
      hGDim.h = 300 - hGDim.t - hGDim.b

      //create svg for histogram.
      const hGsvg = select('#subDiv')
        .append('svg')
        .attr('class', 'chart')
        // .attr('top', '50px')
        // .attr('left', '200px')
        .attr('width', hGDim.w + hGDim.l + hGDim.r)
        .attr('height', hGDim.h + hGDim.t + hGDim.b + 10)
        .style('float', 'left')
        .append('g')

      // create function for x-axis mapping.
      let x = scaleBand([0, hGDim.w], 1)
        .range([0, hGDim.w])
        .domain(
          fD.map(function(d) {
            return d[0]
          })
        )

      // Add x-axis to the histogram svg.
      hGsvg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(20,270)')
        .call(axisBottom(x))

      // Create function for y-axis map.
      const y = scaleLinear()
        .range([hGDim.h, 0])
        .domain([
          0,
          max(fD, function(d) {
            return d[1]
          })
        ])

      // Create bars for histogram to contain rectangles and freq labels.
      const bars = hGsvg
        .selectAll('.bar')
        .data(fD)
        .enter()
        .append('g')
        .attr('class', 'bar')

      //create the rectangles.
      bars
        .append('rect')
        .attr('x', function(d) {
          return x(d[0]) + 40
        })
        .attr('y', function(d) {
          return y(d[1]) + 40
        })
        .attr('width', x.bandwidth() / 1.5)
        .attr('height', function(d) {
          return hGDim.h - y(d[1])
        })
        .attr('fill', barColor)

      //Create the frequency labels above the rectangles.
      bars
        .append('text')
        .text(function(d) {
          return humanTime(d[1])
        })
        .attr('x', function(d) {
          return x(d[0]) + x.bandwidth() / 2.9 + 36
        })
        .attr('y', function(d) {
          return y(d[1]) + 35
        })
        .attr('text-anchor', 'middle')

      // create function to update the bars. This will be used by pie-chart.
      hG.update = function(nD, color) {
        // console.log('this is the new data for histomogram', nD)
        // update the domain of the y-axis map to reflect change in frequencies.
        y.domain([
          0,
          max(nD, function(d) {
            return d[1]
          })
        ])

        // Attach the new data to the bars.
        const bars = hGsvg.selectAll('.bar').data(nD)

        // transition the height and color of rectangles.
        bars
          .select('rect')
          .transition()
          .duration(500)
          .attr('y', function(d) {
            return y(d[1]) + 40
          })
          .attr('height', function(d) {
            return hGDim.h - y(d[1])
          })
          .attr('fill', color)

        // transition the frequency labels location and change value.
        bars
          .select('text')
          .transition()
          .duration(500)
          .text(function(d) {
            return humanTime(d[1])
          })
          .attr('y', function(d) {
            return y(d[1]) + 35
          })

        hGsvg.selectAll('.x-axis').remove()
        // change the axis tick marks to match new data
        x = scaleBand([0, hGDim.w], 0.2)
          .range([0, hGDim.w])
          .domain(
            nD.map(function(d) {
              return d[0]
            })
          )

        hGsvg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(20,270)')
          .call(axisBottom(x))
      }
      return hG
    }

    // function to handle pieChart.
    function pieChart(pD) {
      let pC = {},
        pieDim = {w: 250, h: 250}
      pieDim.r = Math.min(pieDim.w, pieDim.h) / 2

      // create svg for pie chart.
      const piesvg = select('#subDiv')
        .append('svg')
        .style('float', 'left')
        .attr('class', 'chart')
        .style('margin-top', '50px')
        .style('margin-left', '50px')
        .attr('width', pieDim.w)
        .attr('height', pieDim.h)
        .append('g')
        .attr(
          'transform',
          'translate(' + pieDim.w / 2 + ',' + pieDim.h / 2 + ')'
        )

      // create function to draw the arcs of the pie slices.
      const pieArc = arc()
        .outerRadius(pieDim.r - 10)
        .innerRadius(0)

      // create a function to compute the pie slice angles.
      const pieVar = pie()
        .sort(null)
        .value(function(d) {
          return d.time
        })

      // Draw the pie slices.
      piesvg
        .selectAll('path')
        .data(pieVar(pD))
        .enter()
        .append('path')
        .attr('d', pieArc)
        .each(function(d) {
          this._current = d
        })
        .style('fill', function(d) {
          return segColor(d.data.type)
        })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)

      // create function to update pie-chart. This will be used by histogram.
      // pC.update = function(nD){
      //     piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
      //         .attrTween("d", arcTween);
      // }

      // Utility function to be called on mouseover a pie slice.
      function mouseover(d) {
        // console.log('this is the input for mouseover, d: ', d)
        if (d.data.type === 'work') {
          hG.update(
            topFiveWork.map(function(t) {
              return [t.url, t.work]
            }),
            segColor(d.data.type)
          )
        } else if (d.data.type === 'play') {
          hG.update(
            topFivePlay.map(function(t) {
              return [t.url, t.play]
            }),
            segColor(d.data.type)
          )
        }
        // call the update function of histogram with new data.
        // hG.update(data.map(function(v){
        //     return [v.label,v.time[d.data.type]];}),segColor(d.data.type));
      }

      //Utility function to be called on mouseout a pie slice.
      function mouseout() {
        // call the update function of histogram with all data.
        hG.update(
          topFiveTotal.map(function(t) {
            return [t.url, t.play + t.work]
          }),
          barColor
        )
      }
      // Animating the pie-slice requiring a custom function which specifies
      // how the intermediate paths should be drawn.
      function arcTween(a) {
        var i = interpolate(this._current, a)
        this._current = i(0)
        return function(t) {
          return pieArc(i(t))
        }
      }
      return pC
    }

    // function to handle legend.
    function legend(lD) {
      let leg = {}

      const legend = select('#subRightWrapper')
        .append('table')
        .style('float', 'left')
        .style('margin-top', '210px')

      // .style('z-index', '990')
      // .style('top', '550px')
      // .style('left', '1050px')

      // create one row per segment.
      const tr = legend
        .append('tbody')
        .selectAll('tr')
        .data(lD)
        .enter()
        .append('tr')

      // create the first column for each segment.
      tr.append('td')
        .append('svg')
        .attr('width', '16')
        .attr('height', '16')
        .append('rect')
        .attr('width', '16')
        .attr('height', '16')
        .attr('fill', function(d) {
          return segColor(d.type)
        })

      // create the second column for each segment.
      tr.append('td').text(function(d) {
        return d.type + ' //'
      })

      // create the third column for each segment.
      tr.append('td')
        .attr('class', 'legendFreq')
        .text(function(d) {
          return humanTime(d.time) + ' //'
        })

      // create the fourth column for each segment.
      tr.append('td')
        .attr('class', 'legendPerc')
        .text(function(d) {
          return getLegend(d, lD)
        })

      // Utility function to be used to update the legend.
      leg.update = function(nD) {
        // update the data attached to the row elements.
        const l = legend
          .select('tbody')
          .selectAll('tr')
          .data(nD)

        // update the frequencies.
        l.select('.legendFreq').text(function(d) {
          return humanTime(d.freq)
        })

        // update the percentage column.
        l.select('.legendPerc').text(function(d) {
          return getLegend(d, nD)
        })
      }

      function getLegend(d, aD) {
        // Utility function to compute percentage.
        return (
          format('%')(
              d.time /
                sum(
                  aD.map(function(v) {
                    return v.time
                  })
                )
            )
            .slice(0, 5) + '%'
        )
      }

      return leg
    }
  }

  render() {
    return (
      <Container fluid>
        <DatePicker handleDateChange={this.handleDateChange} />
        {/* <Container fluid id="graphs" /> */}
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.visualizations
  }
}

const mapDispatchToProps = {fetchData}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Daily)
)
