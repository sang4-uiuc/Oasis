import React, { Component } from 'react';
import TableRow from './TableRow';
import './Card.css';
import 'react-resizable/css/styles.css';
var _ = require('lodash');
import './Table.css';
import DonutChart from './DonutChart';
import DisplayServers from './DisplayServers';
import MinimizeCard from './MinimizeCard';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';

/**
 * Determines the correct view model for each card
 * @param serverData is passed as props. This is all the server objects within an application
 */

export default class ViewControl extends Component {
    constructor(props) {
        super(props);
        const originalState = getFromLS(this.props.tkey) || "table";
        this.state = {
            stance: originalState,
            key: this.props.tkey,
            downServer: this.props.downServer
        };
        this.changeMini = this.changeMini.bind(this);
        this.changeTable = this.changeTable.bind(this);
        this.changeCircle = this.changeCircle.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    /**
     * Utilizes the passed in props of toMini to change the layout to mini view,
     * while changing and saving the stance in local storage here
     */
    changeMini() {
        saveToLS(this.state.key, "mini");
        this.setState({ stance: "mini" });
        this.props.toMini(this.state.key);
    }

    /**
     * Utilizes the passed in props of toTable to change the layout to table view,
     * while changing and saving the stance in local storage here
     */
    changeTable() {
        saveToLS(this.state.key, "table");
        this.setState({ stance: "table" });
        this.props.toTable(this.state.key);
    }

    /**
     * Utilizes the passed in props of toCircle to change the layout to circle view,
     * while changing and saving the stance in local storage here
     */
    changeCircle() {
        saveToLS(this.state.key, "circle");
        this.setState({ stance: "circle" });
        this.props.toCircle(this.state.key, this.state.downServer);
    }

    /**
     * This one simply returns an object with the number of running/timedout/down servers
     * @param {*} dataArray 
     */
    calculate(dataArray) {
        var ready = [];
        var down = [];
        var timedOut = [];
        var total = { ready: ready, down: down, timedOut: timedOut };
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
        return total;
    }

    /**
     * This built in method is mainly used here to update the cirlce layout when there's a change
     * in the down + timed out servers
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.downServer !== this.props.downServer && this.state.stance === "circle") {
            this.props.toCircle(this.state.key, nextProps.downServer);
            saveToLS(this.state.key, "circle");
        }
    }
    /**
     * Where the magic happens, based on the stance,
     * renders the corresponding component
     */
    render() {
        var stance = this.state.stance;;
        let view = null;
        if (stance === "table") {
            view = <div onDoubleClick={this.changeCircle}>
                <div height='20px'>
                    <AppBar
                        className='title-hover'
                        style={{ backgroundColor: "#323b44", height: 35, boxShadow: 'none' }}
                        titleStyle={{ lineHeight: 'normal', height: 35, textAlign: 'center' }}
                        title={
                            <div style={{ height: 10, marginTop: 5, fontWeight: 100, fontFamily: 'sans-serif', boxShadow: '0 1 1 #ffff', fontSize: 18 }}>{this.props.name}</div>
                        }
                        iconElementLeft={
                            <IconMenu
                                style={{ marginTop: -15, marginLeft: -20 }}
                                iconButtonElement={<IconButton style={{ height: 5, width: 5 }}><DownArrow /></IconButton>}
                                anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                            >
                                <MenuItem onTouchTap={this.changeCircle} style={{ fontSize: 10, height: 5 }} primaryText="Overview" />
                                <MenuItem onTouchTap={this.changeTable} style={{ fontSize: 10 }} primaryText="Table View" />
                                <MenuItem onTouchTap={this.changeMini} style={{ fontSize: 10 }} primaryText="Minimize" />
                            </IconMenu>}
                    />
                </div>
                <div >
                    <table>
                        <TableRow name={this.props.name} data={this.props.data} />
                    </table>
                </div>
            </div>;
        }
        else if (stance === "circle") {
            view = <div onDoubleClick={this.changeTable} >
                <div height='20px'>
                <AppBar
                    className='title-hover'
                    titleStyle={{ lineHeight: 'normal', height: 35 }}
                    style={{ backgroundColor: "#323b44", height: 20, boxShadow: 'none' }}
                    iconElementLeft={
                        <IconMenu
                            menuStyle={{ paddingTop: 0, paddingBottom: 0 }}
                            style={{ marginTop: -15, marginLeft: -20 }}

                            iconButtonElement={<IconButton style={{ height: 5, width: 5 }}><DownArrow /></IconButton>}
                            anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        >
                            <MenuItem onTouchTap={this.changeCircle} style={{ fontSize: 10, padding: 0 }} primaryText="Overview" />
                            <MenuItem onTouchTap={this.changeTable} style={{ fontSize: 10 }} primaryText="Table View" />
                            <MenuItem onTouchTap={this.changeMini} style={{ fontSize: 10 }} primaryText="Minimize" />
                        </IconMenu>}
                />
                </div>
                <div className="app-title">{this.props.name}
                    <DonutChart className="app-title" data={this.props.data} />
                    <DisplayServers className="app-title" data={this.calculate(this.props.data)} />
                </div>
            </div>;
        }
        else if (stance === "mini") {
            view = <div onDoubleClick={this.changeCircle}>
                <AppBar
                    className='title-hover'
                    style={{ backgroundColor: "#323b44", height: 30, boxShadow: 'none' }}
                    titleStyle={{ lineHeight: 'normal', textAlign: 'center' }}
                    title={
                        <div style={{ height: 10, marginTop: 5, fontWeight: 100, fontFamily: 'sans-serif', boxShadow: '0 1 1 #ffff', fontSize: 18 }}>{this.props.name}</div>
                    }
                    iconElementLeft={
                        <IconMenu
                            style={{ marginTop: -15, marginLeft: -20 }}
                            iconButtonElement={<IconButton style={{ height: 5, width: 5 }}><DownArrow /></IconButton>}
                            anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        >
                            <MenuItem onTouchTap={this.changeCircle} style={{ fontSize: 10, height: 5 }} primaryText="Overview" />
                            <MenuItem onTouchTap={this.changeTable} style={{ fontSize: 10 }} primaryText="Table View" />
                            <MenuItem onTouchTap={this.changeMini} style={{ fontSize: 10 }} primaryText="Minimize" />
                        </IconMenu>}
                />
                <div>
                    <MinimizeCard data={this.calculate(this.props.data)} />
                </div>
            </div>
        }
        return (
            <div>
                {view}
            </div>
        );
    }
}

// Retrieves from local storage
function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem(key)) || {};
        } catch (e) {
            console.log("Error accessing local storage in ViewControl.js");
        }
    }
    return ls[key];
}

// Saves to local storage
function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(key, JSON.stringify({
            [key]: value
        }));
    }
}