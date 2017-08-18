import React, { Component } from 'react';
var _ = require('lodash');
import './DisplayServers.css';

let maxServers = 15; // Max down/time out servers to be displayed on the card
/**
 * This class displays the individual servers on the 'Circle View' of the card
 */
export default class DisplayServers extends Component {
    constructor(props) {
        super(props)
        this.listServers = this.listServers.bind(this);
        this.displayExtraServers = this.displayExtraServers.bind(this);
        this.displayServersToCard = this.displayServersToCard.bind(this);
    }
    /**
     * Displays the last two elements of servers which contain the extra down or timed out 
     * servers that could not be displayed on the card.
     * @param {* number of servers that couldn't be displayed} num 
     * @param {* list of servers only used to retrieve status/color} servers 
     */
    displayExtraServers(num, servers) {
        let status = "";
        let pluralServer = "servers";
        // If only one server display 'server' singluar
        if(num === 1) {
            pluralServer = "server";
        }
        // Check that array isn't empty
        if (num > 0) {
            // status to display as text
            switch (servers[0]._status) {
                case 'Timeout':
                    status = 'timed out';
                    break;
                default: status = 'down';
            }
            return (
                <div className='element'>
                    <svg className="cell" width="10px" height="10px">
                        <circle cx="50%" cy="50%" r="6" fill={servers[0].getStatusColor()} />
                        <text className="plus" x="0.5px" y="9px">+</text>
                    </svg>
                    <div className='body'>{(num) + " "+ pluralServer +" " + status}</div>
                </div>
            );
        }
    }
    /**
     * This method displays the servers with a small circle indicating 
     * if it is down (red) or timed out (yellow).
     * @param {* how many servers to display from the list} length 
     * @param {* list of servers} servers 
     */
    displayServersToCard(length, servers) {
        return _.map(_.range(length), function (i) {

            return (
                <div key={servers[i]._serverName} className='element'>
                    <svg className="cell" width="10px" height="10px">
                        <circle cx="50%" cy="50%" r="6" fill={servers[i].getStatusColor()} />
                    </svg>
                    <div className='body'>{servers[i]._serverName}</div>
                </div>
            );
        });
    }
    /**
     * This method calculates how many servers should be displayed depeneding on the
     * maxServers allowed. Calls two functions to display individual servers and to 
     * display the number of extras that could not fit.
     * @param {* list of servers} servers 
     */
    listServers(servers) {
        let numDown = servers.down.length;
        let numTimeOut = servers.timedOut.length;
        // Check for down servers to be displayed and make room for extras
        if (servers.down.length > maxServers) {
            numDown = maxServers - 1;
            if (servers.timedOut.length > 0) {
                numDown = maxServers - 2;
                numTimeOut = 0;
            }
            // Check for time out servers to be displayed or showed as extras
        } else if (servers.timedOut.length > 0 && numDown < maxServers) {
            if (numTimeOut > maxServers - servers.down.length) {
                numTimeOut = maxServers - servers.down.length;
                // Check if all timed out servers can be displayed, if not reduce by 1 to make space to display extras
                if(numTimeOut < servers.timedOut.length){
                    numTimeOut--;
                }
            } 
        }
        return (
            <g>
                <div>{this.displayServersToCard(numDown, servers.down)}</div>
                <div>{this.displayServersToCard(numTimeOut, servers.timedOut)}</div>
                <div>{this.displayExtraServers(servers.down.length - numDown, servers.down)}</div>
                 <div>{this.displayExtraServers(servers.timedOut.length - numTimeOut, servers.timedOut)}</div>   
            </g>
        );
    }
    render() {
        return (
            <div className="server-row">
                {this.listServers(this.props.data)}
            </div>
        );
    }
}