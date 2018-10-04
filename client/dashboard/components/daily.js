import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'

const mapStateToProps = (state) => {
    return {
        data: state.visualizations.data
    }
}

class Daily extends React.Component {
    constructor(){
        super()
        this.createDashboard = this.createDashboard.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.removeDashboard('svg')
        this.removeDashboard('table')
    }

    removeDashboard(className){
        d3.selectAll(className).remove()
    }



    createDashboard(id, data){

            var topFiveTotal = [];
            var topFivePlay = [];
            var topFiveWork = [];
            var totalWork = 0;
            var totalPlay = 0;

            const findTopFiveTotal = (dataSet) => {
                let sortedArr = dataSet.sort(function(a, b){return b.timeTotal - a.timeTotal})
                return sortedArr.slice(0,5)
            }
            const findTopFivePlay = (dataSet) => {
                let playArr = dataSet.filter(e => e.label === 'play')
                return playArr.sort(function(a, b){return b.timeTotal - a.timeTotal}).slice(0,5)
            }
            const findTopFiveWork = (dataSet) => {
                let playArr = dataSet.filter(e => e.label === 'work')
                return playArr.sort(function(a, b){return b.timeTotal - a.timeTotal}).slice(0,5)
            }
            const findTotalWork = (dataSet) => {
                let total = 0;
                for (let i = 0; i < dataSet.length; i++){
                    if(dataSet[i].label === 'play'){
                        total += dataSet[i].timeTotal
                    }
                }
                return total
            }
            const findTotalPlay = (dataSet) => {
                let total = 0;
                for (let i = 0; i < dataSet.length; i++){
                    if(dataSet[i].label === 'work'){
                        total += dataSet[i].timeTotal
                    }
                }
                return total
            }

            topFiveTotal = findTopFiveTotal(this.props.data)
            topFivePlay = findTopFivePlay(this.props.data)
            topFiveWork = findTopFiveWork(this.props.data)
            totalWork = findTotalWork(this.props.data)
            totalPlay = findTotalPlay(this.props.data)

            console.log('this is topFiveTotal', topFiveTotal);
            console.log('this is topFiveWork', topFiveWork);
            console.log('this is topFivePlay', topFivePlay);
            console.log('this is totalWork', totalWork);
            console.log('this is totalPlay', totalPlay);

            var barColor = 'steelblue';
            function segColor(c){ return {work:"#807dba", play:"#e08214"}[c]; }

            // calculate total frequency by segment for all state.
            var tF = ['play','work'].map(function(d){ 
                return {type:d, time: d3.sum(data.map(function(t){ 
                    if (t.label === d){
                    return t.timeTotal;
                }}))}; 
            });    
            console.log('this is tf', tF)
            
            // calculate total frequency by state for all segment.
            var sF = topFiveTotal.map(function(d){return [d.url,d.timeTotal,d.label];});
            console.log('this is sf for histomogram', sF)
            var hG = histoGram(sF), // create the histogram.
                pC = pieChart(tF), // create the pie-chart.
                leg= legend(tF);  // create the legend.
            

            // function to handle histogram.
            function histoGram(fD){
                console.log('this is fd', fD)
                var hG={},
                    hGDim = {t: 60, r: 0, b: 30, l: 0};
                hGDim.w = (500 - hGDim.l - hGDim.r) / 1.5;
                hGDim.h = 300 - hGDim.t - hGDim.b;
                    
                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
                    .attr("class", "chart")
                    .attr("width", hGDim.w + hGDim.l + hGDim.r)
                    .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
                    .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
        
                // create function for x-axis mapping.
                var x = d3.scaleBand([0, hGDim.w/1.8], 0.1)
                        .range([0, hGDim.w/1.5])
                        .domain(fD.map(function(d) { return d[0]; }));
        
                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x-axis")
                    .attr("transform", "translate(0," + hGDim.h + ")")
                    .call(d3.axisBottom(x));
        
                // Create function for y-axis map.
                var y = d3.scaleLinear().range([hGDim.h, 0])
                        .domain([0, d3.max(fD, function(d) { return d[1]; })]);
        
                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                        .append("g").attr("class", "bar");
                

                //create the rectangles.
                bars.append("rect")
                    .attr("x", function(d) { return x(d[0]); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("width", x.bandwidth()/1.5)
                    .attr("height", function(d) { return hGDim.h - y(d[1]); })
                    .attr('fill',barColor)
                    
                //Create the frequency labels above the rectangles.
                bars.append("text").text(function(d){ return d3.format(",")(d[1])})
                    .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
                    .attr("y", function(d) { return y(d[1])-5; })
                    .attr("text-anchor", "middle");
                
                // create function to update the bars. This will be used by pie-chart.
                hG.update = function(nD, color){
                    console.log('this is the new data for histomogram', nD)
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
                    
                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);
                    
                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                        .attr("y", function(d) {return y(d[1]); })
                        .attr("height", function(d) { return hGDim.h - y(d[1]); })
                        .attr("fill", color);
        
                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                        .text(function(d){ return d3.format(",")(d[1])})
                        .attr("y", function(d) {return y(d[1])-5; });
                    
                    hGsvg.selectAll(".x-axis").remove()
                    // change the axis tick marks to match new data
                    x = d3.scaleBand([0, hGDim.w], 0.2)
                        .range([0, hGDim.w])
                        .domain(nD.map(function(d) { return d[0]; }));



                        hGsvg.append("g").attr("class", "x-axis")
                        .attr("transform", "translate(0," + hGDim.h + ")")
                        .call(d3.axisBottom(x));
                }        
                return hG;
            }
            
            // function to handle pieChart.
            function pieChart(pD){
                var pC ={},    
                    pieDim ={w:250, h: 250};
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;    
                        
                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
                    .attr("class", "chart")
                    .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                    .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
                
                // create function to draw the arcs of the pie slices.
                var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);
        
                // create a function to compute the pie slice angles.
                var pie = d3.pie().sort(null).value(function(d) { return d.time; });
        
                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
                    .each(function(d) { this._current = d; })
                    .style("fill", function(d) { return segColor(d.data.type); })
                    .on("mouseover",mouseover).on("mouseout",mouseout);
        
                // create function to update pie-chart. This will be used by histogram.
                // pC.update = function(nD){
                //     piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                //         .attrTween("d", arcTween);
                // }        

                // Utility function to be called on mouseover a pie slice.
                function mouseover(d){
                    console.log('this is the input for mouseover, d: ', d)
                    if(d.data.type === 'work'){
                        hG.update(topFiveWork.map(function(t){
                            return [t.url,t.timeTotal,t.label];}), segColor(d.data.type))
                    } else if (d.data.type === 'play'){
                        hG.update(topFivePlay.map(function(t){
                            return [t.url,t.timeTotal,t.label];}), segColor(d.data.type))
                    }
                    // call the update function of histogram with new data.
                    // hG.update(data.map(function(v){ 
                    //     return [v.label,v.time[d.data.type]];}),segColor(d.data.type));
                }

                var sF = topFiveTotal.map(function(d){return [d.url,d.timeTotal,d.label];});

                //Utility function to be called on mouseout a pie slice.
                function mouseout(){
                    // call the update function of histogram with all data.
                    hG.update(topFiveTotal.map(function(t){
                        return [t.url,t.timeTotal,t.label];}), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) { return arc(i(t));    };
                }    
                return pC;
            }
            
            // function to handle legend.
            function legend(lD){
                console.log('this is lD', lD)
                var leg = {};
                    
                // create table for legend.
                var legend = d3.select(id).append("table").attr('class','legend')
                
                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
                    
                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                    .attr("width", '16').attr("height", '16')
                    .attr("fill",function(d){ return segColor(d.type); });
                    
                // create the second column for each segment.
                tr.append("td").text(function(d){ return d.type;});

                // create the third column for each segment.
                tr.append("td").attr("class",'legendFreq')
                    .text(function(d){ return d3.format(",")(d.time) + ' seconds';});
        
                // create the fourth column for each segment.
                tr.append("td").attr("class",'legendPerc')
                    .text(function(d){ return getLegend(d,lD);});
        
                // Utility function to be used to update the legend.
                leg.update = function(nD){
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);
        
                    // update the frequencies.
                    l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});
        
                    // update the percentage column.
                    l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
                }
                
                function getLegend(d,aD){ // Utility function to compute percentage.
                    return d3.format("%")(d.time/d3.sum(aD.map(function(v){ return v.time; }))).slice(0,5) + '%';
                }
        
                return leg;
            }
            

        
    }

    render(){
        console.log(this.props)
        if (this.props.data){
            this.createDashboard('#dashboard', this.props.data)
            console.log('these are the props', this.props)
            return(
                <div id="dashboard" />
            )
        } else {
            return(
                <div id="dashboard" />
            )
        }
    }
}

export default connect(mapStateToProps)(Daily)
