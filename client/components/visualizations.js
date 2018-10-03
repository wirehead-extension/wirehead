import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { tsv, csv, json } from 'd3-fetch'
// import dataSet from './data.tsv'


const dataSet = require('dsv-loader!./data.tsv')

class Visualizations extends React.Component {

    componentDidMount() {
        this.createBarChart()
    }

    createBarChart(){

        var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%Y %b %d");

        var x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        var stack = d3.stack();

        var area = d3.area()
            .x(function(d, i) { return x(d.data.date); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); });

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            function type(d, i, columns) {
            d.date = parseDate(d.date);
            for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
            return d;
            }

        tsv("data.tsv", type).then(function(data) {
        
        var keys = data.columns.slice(1);

        x.domain(d3.extent(data, function(d) { return d.date; }));
        z.domain(keys);
        stack.keys(keys);

        var layer = g.selectAll(".layer")
            .data(stack(data))
            .enter().append("g")
            .attr("class", "layer");

        layer.append("path")
            .attr("class", "area")
            .style("fill", function(d) { return z(d.key); })
            .attr("d", area);

        layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
            .append("text")
            .attr("x", width - 6)
            .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
            .attr("dy", ".35em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "end")
            .text(function(d) { return d.key; });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "%"));
        }).catch(function(e){
            console.log('This is the error', e)
        });


}








    render(){
        console.log(this.props)
        console.log(dataSet)
        return(
            <svg ref={node => this.node = node}
            width={500} height={500} />
        )
    }
}


// export default connect(mapStateToProps)(Visualizations)
export default Visualizations