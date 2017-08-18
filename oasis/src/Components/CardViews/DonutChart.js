import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import ReactFauxDOM from 'react-faux-dom';
require('./d3DonutChart.css');
let d3 = require('d3');

class DonutChart extends Component {
    constructor(props) {
        super(props);
        this.calculateChart = this.calculateChart.bind(this);
        this.draw = this.draw.bind(this);
    }

    /**
     * Draw is where most of the work is done. The actual drawing of the 
     * elements is in this method. It creates the pie chart using percent and 
     * details the rest of the drawing. The circle can also be clicked on, which 
     * is registered through dispatcher.
     * 
     */
    draw() {
        let percent = this.calculateChart(this.props.data);
        let height = 100;
        let width = 100;
        // Create fauxDOM element
        let div = new ReactFauxDOM.createElement('div');
        // Use d3 to build the circle
        let svg = d3.select(div)
            .attr('class', 'parent-div')
            .attr('width', width)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'shadow')
            .append('g')
            .attr('class', 'g')
            .attr('transform', 'translate(' + height / 2 + ',' + height / 2 + ')');
        // Data percents
        let pie = d3.pie()
            .value(function (d) { return d.value; })
            .sort(null)
            .padAngle(0);
        let outerRadius = 42;
        let innerRadius = 35;
        let arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);
        // Draw data paths
        let g = d3.select(div).select('svg').selectAll('g');
        let path = g.selectAll('path')
            .data(pie(percent))
            .enter()
            .append('path')
            .attr('d', arc)
            .style('shape-rendering', 'geometricPrecision')
            .attr('fill', function (d, i) { return percent[i].color; });
        // .on('click', function (d) { dispatcher.emit('path:click', d); });
        path.transition()
            .duration(1000)
            .attrTween('d', function (d) {
                var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });
        path.exit().remove();
        // Inner circle
        let center = g.append('g')
            .append('circle')
            .attr('r', innerRadius)
            .attr('fill', '#18184f')
            .style('shape-rendering', 'geometricPrecision')
        g.append('text')
            .attr('class', 'text-label')
            .attr('text-anchor', 'middle')
            // .attr('text-align', 'center')
            .attr('dominant-baseline', 'central')
            .style('fill', 'white')
            .text(percent[0].value + "%");
        return div.toReact();
    }
    /**
     * Calculates the status, percent and colors of the donut chart.
     * This method may not me used and instead will be passed as a prop. 
     * Then from that prop it can just caluclate the percent.
     * 
     * @param {*} dataArray 
     */
    calculateChart(dataArray) {
        var ready = 0;
        var down = 0;
        var timedOut = 0;
        for (var i = 0; i < dataArray.length; i++) {
            var status = dataArray[i]._status;
            if (status === "Running") {
                ready = ready + 1;
            } else if (status === "Timeout") {
                timedOut = timedOut + 1;
            } else {
                down = down + 1;
            }
        }
        // Check for 0 values before calculating the percentages
        // Rounds down for percentage calculations
        if (ready > 0) {
            ready = Math.floor(ready / dataArray.length * 100);
        }
        if (down > 0) {
            down = Math.floor(down / dataArray.length * 100);
        }
        if (timedOut > 0) {
            timedOut = Math.floor(timedOut / dataArray.length * 100);
        }
        var percents = [{ id: dataArray[0]._serverName, value: ready, color: '#30dd05' }, { id: dataArray[0]._serverName, value: down, color: '#e53e3e' }, { id: dataArray[0]._serverName, value: timedOut, color: 'orange' }];
        return percents;
    }
    render() {
        return this.draw();
    }
}

export default DonutChart;