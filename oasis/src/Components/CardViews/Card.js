
import React, { Component } from 'react';
var PropTypes = require('prop-types');
import update from 'react-addons-update';
var _ = require('lodash');
import './Card.css';
import 'react-resizable/css/styles.css';
let WidthProvider = require('react-grid-layout').WidthProvider;
let ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
import Key from './Key';
import Alerts from './Alerts';
import ViewControl from './ViewControl';
import $ from 'jquery';
/**
 * Card renders the different Card faces (minimized, full, expanded).
 * It calculates the 'down' servers to be displayed on the full side. 
 * It then renders the classes depending on the view of the card (min, full, expand).
 * 
 */

// Uncomment the line below to clear local storage to test layout, etc.
// localStorage.clear();

class Card extends Component {
    constructor(props) {
        super(props)
        var originalLayouts = getFromLS('layout') || this.generateLayout();
        // Check if local storage is empty or a new server has been added and call generateLayout
        if (getFromLS('layout') === undefined || this.generateLayout().lg.length > getFromLS('layout').lg.length) {
            originalLayouts = this.generateLayout();
        }
        this.state = {
            layout: JSON.parse(JSON.stringify(originalLayouts))
        };
        this.changeCircle = this.changeCircle.bind(this);
        this.changeTable = this.changeTable.bind(this);
        this.changeMini = this.changeMini.bind(this);
        this.generateLayout = this.generateLayout.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.generateDOM = this.generateDOM.bind(this);
        this.calculateDown = this.calculateDown.bind(this);
        this.getDimensions = this.getDimensions.bind(this);
    }
    /**
     * Check if title is longer than width of table
     * Return title length/2 if it is
     */
    titleLengthCheck = (pdata, cols, rows) => {
        if (pdata.name.length > cols) {
            return { colLength: pdata.name.length/2, rowLength: rows };
        }
        return { colLength: cols, rowLength: rows };
    }
    /**
     * For smaller apps that provide different data
     * This method finds the table format and provides dimensions
     * Calls titleLengthCheck to determine if the title is larger than
     * the calculated columns
     */
    nonStandardTable = (pdata) => {
        let cols = [];
        let rows = [];
        let dc = ['ams', 'iad', 'sjc'];
        let j = 0;
        let cageNum = 1;
        let maxCols = 0;
        let name = "";
        let nextName = "";
        let data = pdata.data;

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {

                // Check if the next server is in a different group
                if (i + 1 < data.length) {
                    // Maelstrom and CG have different data
                    // Check Maelstrom against dc and CG against servername
                    if (pdata.name === 'Maelstrom') {
                        name = data[i]._dc;
                        nextName = data[i + 1]._dc;
                    } else {
                        name = data[i]._serverName;
                        nextName = data[i + 1]._serverName;
                    }
                    if (name === nextName && data[i]._dc === data[i + 1]._dc) {
                        cols.push(data[i]);
                    }
                    else {
                        cols.push(data[i]);
                        rows.push({ rowNum: cageNum, col: cols, rowSpan: 1 });
                        cols = [];
                        cageNum++;
                    }
                } else {
                    cols.push(data[i]);
                    rows.push({ rowNum: cageNum, col: cols, rowSpan: 1 });
                }
            }
        }
        return this.titleLengthCheck(pdata,cols.length, rows.length);
    }
    getDimensions(pdata) {
        var data = pdata.data;
        let cols = [];
        let rows = [];
        let dc = ['ams', 'iad', 'sjc'];
        let j = 0;
        let cageNum = 1;
        let rowSpan = 0; //rowSpan used for calculating the dc header
        let maxCols = 0;

        // Check for non-standard tables
        // CG
        if (data.length < 10) {
            if (pdata.name === 'Maelstrom') {
                return this.nonStandardTable(pdata);
            }
            return { colLength: data.length, rowLength: data.length };
        }

        // Iterate through data list to determine table rows and columns
        for (var i = 0; i < data.length; i++) {
            // Check if dc is the same, and cage numbers are the same to determine the row
            let dcEquality = data[i]._dc.toLocaleLowerCase().valueOf() === dc[j].toLocaleLowerCase().valueOf();
            if (dcEquality === true && data[i]._cageNum === cageNum) {
                cols.push(data[i]);
                // Check the data center type. If different, increase to the next dc and restart
            } else if (dcEquality === false) {
                rowSpan = cageNum;
                j++; // next dc
                rows.push({ rowNum: cageNum, col: cols, rowSpan: rowSpan }); // new row
                if (cols.length > maxCols) {
                    maxCols = cols.length;
                }
                cageNum = 1; // reset cageNum to 1 since it is a new dc
                cols = []; // clear columns to new row
                cols.push(data[i]);
            } else if (data[i]._cageNum === cageNum + 1) {
                rows.push({ rowNum: cageNum, col: cols, rowSpan: 0 }); // next row
                if (cols.length > maxCols) {
                    maxCols = cols.length;
                }
                cageNum++;
                cols = []; // clear columns to new row
                cols.push(data[i]);
            } else {
                rows.push({ rowNum: cageNum, col: cols, rowSpan: 0 });
                if (cols.length > maxCols) {
                    maxCols = cols.length;
                }
                while (cageNum < data[i]._cageNum) {
                    cageNum++;
                }
                cols = [];
                cols.push(data[i]);
            }
            rowSpan = 0;
            if (cols.length > maxCols) {
                maxCols = cols.length;
            }
        }
        rows.push({ rowNum: cageNum, col: cols, rowSpan: cageNum });
        maxCols = parseInt(maxCols, 10);

        return this.titleLengthCheck(pdata, maxCols, rows.length);
    }

    /**
     * Changes the view layout to mini view
     * @param {*} index - the key corresponding to the server
     */
    changeMini(index) {
        this.setState({
            layout: update(this.state.layout, {
                lg: { [index]: { h: { $set: 4 }, w: { $set: 180 } } }
            }
            )
        })
    }

    /**
     * Changes the view layout to table view
     * @param {*} index - the key corresponding to the server
     */
    changeTable(index) {
        var totaldata = this.props.data;
        var tArr = [];
        var d = 0;
        for (var i = 0; i < totaldata.length; i++) {
                // Use the dimensions of the table to determine card size
                d = this.getDimensions(totaldata[i]);
                // Add extra space for headers
                d.colLength = d.colLength  * 15/*approximate width of a column*/ + 82/*approximate width of the dc columns*/;
                d.rowLength += 4/*approximate height of the title*/;
                tArr.push(d);
        }
        this.setState({
            layout: update(this.state.layout, {
                lg: { [index]: { h: { $set: tArr[index].rowLength }, w: { $set: tArr[index].colLength } } }
            }
            )
        });
        console.log('-----In changeTable------------------');
        console.log("The dimensions below is: " + index);
        console.log(localStorage[parseInt(index)]);
        console.log("width is: " + this.state.layout.lg[index].w);
        console.log("height is: " + this.state.layout.lg[index].h);
        console.log(this.state.layout);
    }
    /**
     * Changes the view layout to circle view
     * @param {*} index - the key corresponding to the server
     * @param {*} outServer - the sum of down and timedout servers
     */
    changeCircle(index, outServer) {
        var circleWidth = 0;
        if (outServer === 0) {
            circleWidth = 230;
        }
        else if (outServer > 0 && outServer < 6) {
            circleWidth = 350;
        }
        else if (outServer > 5 && outServer < 11) {
            circleWidth = 460;
        }
        else {
            circleWidth = 610;
        }
        this.setState({
            layout: update(this.state.layout, {
                lg: { [index]: { h: { $set: 12 }, w: { $set: circleWidth } } }
            }
            )
        });
        console.log('-----In changeCircle------------------');
        console.log("The dimensions below is: " + index);
        console.log(localStorage[parseInt(index)]);
        console.log("width is: " + this.state.layout.lg[index].w);
        console.log("height is: " + this.state.layout.lg[index].h);
        console.log(this.state.layout);
    }

    /**
     * Given the array of servers from one application, this method 
     * calculates the down servers and the timed out servers. 
     * 
     * @param dataArray  
     */
    calculateDown(dataArray) {
        var ready = [];
        var down = [];
        var timedOut = [];
        for (var i = 0; i < dataArray.length; i++) {
            var status = dataArray[i]._status;
            if (status === "Running") {
                ready.push(dataArray[i]);
            } else if (status === "Timeout") {
                timedOut.push(dataArray[i]);
            } else {
                down.push(dataArray[i]);
            }
        }
        return down.length + timedOut.length;
    }

    /**
     * Iterates through the data and renders it to the page. 
     */
    generateDOM() {
        let boolKey = false;
        let boolAlert = false;
        let misc = 1;
        console.log('-----In generateDOM------------------');
        console.log("The dimensions below is: " + '0');
        console.log(localStorage[0]);
        console.log("width is: " + this.state.layout.lg[0].w);
        console.log("height is: " + this.state.layout.lg[0].h);
        console.log(this.state.layout);
        console.log('-----------------------------------');
        return _.map(_.range(this.props.data.length + misc), function (i) {
            // Display miscellaneous cards - Key and Alerts
            if (i >= this.props.data.length) {
                if (boolKey === false) {
                    boolKey = true;
                    return (
                        <div key={'key'} >
                            <Key tkey={this.props.data.length} />
                        </div>);
                }
                // if (boolAlert === false) {
                //     boolAlert = true;
                //     return (
                //         <div key={'alerts'}>
                //             <Alerts />
                //         </div>);
                // }
            }
            return (
                <div key={i} >
                    <ViewControl
                        name={this.props.data[i].name}
                        data={this.props.data[i].data}
                        toMini={this.changeMini}
                        toTable={this.changeTable}
                        toCircle={this.changeCircle}
                        tkey={i}
                        downServer={this.calculateDown(this.props.data[i].data)}
                    />
                </div>);
        }.bind(this));
    }

    /**
     * If movement or resizing occurs, call to change the layout accordingly
     */
    onLayoutChange(layout, layouts) {
        saveToLS('layout', layouts);
        this.setState({ layout: layouts });
    }

    // changes the layout on window change
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    // forces update on window resize
    handleResize = () => {
 
            this.forceUpdate();
        
    };

    /**
     * Renders the Card Component and calls the generateDOM class
     * This is where the initial layout is laid out on first view, after changing it
     * local storage will remember, and won't use this again unless new servers are added
     */
    generateLayout() {
        var totaldata = this.props.data;
        var tArr = [];
        var d = 0;
        for (var i = 0; i < totaldata.length; i++) {
            // Use the dimensions of the table to determine card size
            d = this.getDimensions(totaldata[i]);
            // Add extra space for headers
            d.colLength = d.colLength * 15 + 82;
            d.rowLength += 4;
            tArr.push(d);
        }

        // Dynamically sets the card locations
        var layout1 = [];
        var widthCounter = Array(totaldata.length).fill(0);
        for(var j = 0; j< totaldata.length; j++){
            for(var k = 0; k< widthCounter.length; k++){
                // Sets the card if there is enough width space
                if($(window).width() - (widthCounter[k] + tArr[j].colLength) > 0){
                    layout1.push(
                        { i: j.toString(), x: widthCounter[k], y: Infinity, w: tArr[j].colLength, h: tArr[j].rowLength },
                    )
                    widthCounter[k] += tArr[j].colLength;
                    break;
                }
            }
        }
        // Key is pushed in last
        layout1.push(
            { i: 'key', x: $(window).width() - 180, y: 0, w: 180, h: 10 }
        )
        // You can set layout manually here below
        // var layout1 = [
        //     { i: '0', x: 0, y: 0, w: tArr[0].colLength, h: tArr[0].rowLength },
        //     { i: '1', x: tArr[0].colLength, y: 0, w: tArr[1].colLength, h: tArr[1].rowLength },
        //     { i: '2', x: tArr[3].colLength, y: tArr[0].rowLength, w: tArr[2].colLength, h: tArr[2].rowLength },
        //     { i: '3', x: 0, y: 0, w: tArr[3].colLength, h: tArr[3].rowLength },
        //     { i: '4', x: tArr[0].colLength + tArr[1].colLength, y: 0, w: tArr[4].colLength, h: tArr[4].rowLength },
        //     { i: '5', x: tArr[0].colLength + tArr[1].colLength + tArr[4].colLength, y: 0, w: tArr[5].colLength, h: tArr[5].rowLength },
        //     { i: '6', x: tArr[0].colLength + tArr[1].colLength + tArr[4].colLength + tArr[5].colLength, y: 0, w: tArr[6].colLength, h: tArr[6].rowLength },
        //     { i: '7', x: tArr[0].colLength + tArr[1].colLength + tArr[4].colLength + tArr[5].colLength + tArr[6].colLength, y: 0, w: tArr[7].colLength, h: tArr[7].rowLength },
        //     { i: '8', x: tArr[0].colLength + tArr[1].colLength + tArr[4].colLength + tArr[5].colLength + tArr[6].colLength, y: 0, w: tArr[8].colLength, h: tArr[8].rowLength },
        //     { i: 'key', x: $(window).width() - 180, y: 0, w: 180, h: 10 },
        //     //{ i: 'alerts', x: 28, y: 2, w: 4, h: 9, minW: 4, minH: 4 }
        // ];
        return { lg: layout1 };
    }
    render() {
        return (
            <div className="Card">
                <ResponsiveReactGridLayout
                    ref="rrgl"
                    breakpoints={{ lg: 1 }}
                    cols={{ lg: $(window).width() }}
                    layouts={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}>
                    {this.generateDOM()}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}

//Function for accessing local storage
function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem('oasis')) || {};
        } catch (e) {
            console.log("Error with local storage in Card.js");
        }
    }
    return ls[key];
}

//Function for saving to local storage
function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem('oasis', JSON.stringify({
            [key]: value
        }));
    }
}

Card.PropTypes = {
    onLayoutChange: PropTypes.func.isRequired,
    data: PropTypes.Array
};
export default Card;