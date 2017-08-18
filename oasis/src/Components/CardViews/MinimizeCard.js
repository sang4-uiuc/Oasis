import React, { Component } from 'react';
var _ = require('lodash');
import './Card.css';
import 'react-resizable/css/styles.css';
import Bar from './Bar';
import './MinimizeCard.css';
/**
 * MinimizeCard displays the minimized view. This contains
 * the title of the app and the status bar.
 * 
 */
class MinimizeCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
        testData: {
            ready: this.props.data.ready,
            down: this.props.data.down,
            timedOut: this.props.data.timedOut
        }
        };
    }

    render() {
        return (
            <div>
                <Bar data={this.state.testData} />
            </div>
        );
    }

}
export default MinimizeCard;