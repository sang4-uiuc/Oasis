import React, { Component } from 'react';
var _ = require('lodash');
import './Table.css';
/**
 * This draws the blocks for the table and displays the tooltip
 * on hover.
 */
export default class TableBlock extends Component {
    constructor(props) {
        super(props);
        this.displayHostNumber = this.displayHostNumber.bind(this);
        this.displayBorder = this.displayBorder.bind(this);
    }
    /**
     * This method displays the host number inside of the box if the server
     * is not in a 'Running' state.
     * @param {*} server 
     */
    displayHostNumber(server) {
        if (server._status !== "Running" || server._prod === false) {
            return <text fill='#121a96' x='1.5' y='10'>{server._hostNum}</text>;
        }
        return 'null';
    }
    /**
     * This method determines if the box should have a border. If it is a canary or
     * version installed today, a border will be displayed around the box.
     * @param {*} server 
     */
    displayBorder(server) {
        if (server._prod === false) {
            return <rect x="1" y="1" width="11px" height="11px" fill={server.getStatusColor()}  stroke={'#ffff00'} strokeWidth="1.8"/>;
        }
        return <rect x="0" y="0"  width="13px" height="13px" fill={server.getStatusColor()} />
        
    }
    render() {
        const { data } = this.props;
        /* 
        Use map to perform the same function on each element in the obj array.
        Tooltip info (serverName, version, and id) are displayed on hover.
        */
        const col = _.map(_.range(data.length), function (i) {
            return (
                <td key={i} className='cell'>
                    <a className="tooltiptext" title={data[i]._serverName + " " + data[i]._version + " " + data[i]._id}>
                        <svg className="cell"  width="13px" height="13px">
                            <g>
                                <g>{this.displayBorder(data[i])}</g>
                                <g>{this.displayHostNumber(data[i])}</g>
                            </g>
                        </svg>
                    </a>
                </td>);
        }.bind(this));
        return (
            <span>{col}</span>
        );
    }
}