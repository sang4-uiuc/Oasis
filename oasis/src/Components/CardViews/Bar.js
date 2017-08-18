import React, { Component } from 'react';
var _ = require('lodash');
import './Bar.css';

/** Bar : draws a bar as part of a bar graph */
class Bar extends Component {
	/**
	 * Returns the length of bar to be displayed proportional to the
	 * status percent - running, down, time out
	 * By only rendering each element if there is servers to be displayed,
	 * we can round the edges of the first and last element.
	 */
	barStatus = () => {
		let data = this.props.data;
		let totalWidth = data.ready.length + data.timedOut.length + data.down.length;
		var ready = false;
		var down = false;
		var timedOut = false;
		const bar = _.map(_.range(3), function (i) {
			if (data.ready.length > 0 && ready === false) {
				ready = true;
				return (
					<span key={i} className="bar-expand" style={{
						width: data.ready.length / totalWidth * 100 + '%',
						background: '#4ee248'
					}}>
					</span>
				);
			} else if (data.down.length > 0 && down === false) {
				down = true;
				return (
					<span key={i} className="bar-expand" style={{
						width: data.down.length / totalWidth * 100 + '%',
						background: '#e53e3e'
					}}>
					</span>
				);
			} else if (data.timedOut.length > 0 && timedOut === false) {
				timedOut = true;
				return (
					<span key={i} className="bar-expand" style={{
						width: data.timedOut.length / totalWidth * 100 + '%',
						background: '#ff9900'
					}}>
					</span>
				);
			}
			return null;
		});
		return bar;
	}
	render() {
		return (
			<div>
				<div className="bar-contain" >
					{this.barStatus()}
				</div>
			</div>
		);
	}
}

export default Bar;