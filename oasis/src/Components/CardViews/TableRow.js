import React, { Component } from 'react';
var _ = require('lodash');
import TableBlock from './TableBlock';
import './Table.css';

/**
 * TableRow formats the data into columns and rows based on the 
 * cageNum and dc. It also calculates how many rows the dc header
 * should span, formatting the table.
 */
export default class TableRow extends Component {
  constructor(props) {
    super(props);
    this.calculateHeaderSpan = this.calculateHeaderSpan.bind(this);
  }
  /**
   * This calculates how many rows the data center header should span.
   * Calculates how many cages in each data center.
   * Example: AMS header spans over 4 rows for DMA
   */
  calculateHeaderSpan(rows, i) {
    // Don't return the rowSpan if not the first element in dc
    if (rows[i].rowNum > 1) {
      return null;
    }
    // Rowspan is located in final element of dc - return the rowspan
    // or how many cage numbers to span for the dc header
    while (i < rows.length) {
      if (rows[i].rowSpan !== 0) {
        return (<th className="dc-header" rowSpan={rows[i].rowSpan}>{rows[i].col[0]._dc}</th>);
      }
      i++;
    }
    return null;
  }
  /**
   * This is for creating the CG table which displays only the app and the dc in the header
   */
  calculateNonStandardHeaderSpan = (rows, i) => {
    // Rowspan is located in final element of dc - return the rowspan
    // or how many cage numbers to span for the dc header
    while (i < rows.length) {
      if (rows[i].rowSpan !== 0) {
        // Display the DC if showing Maestro card
        if (this.props.name === 'Maestro' || this.props.name === 'Maelstrom') {
          return (
            <th className="dc-header" rowSpan={rows[i].rowSpan}>{rows[i].col[0]._dc}</th>
          );
        }
        return (
          <th className="dc-header" rowSpan={rows[i].rowSpan}>{rows[i].col[0]._serverName}</th>
        );
      }
      i++;
    }
    return null;
  }
  /**
   * If CG, show dc in second header column
   */
  headerCG = (rows, i) => {
    if (this.props.name === 'CG') {
      return <th>{rows[i].col[0]._dc}</th>;
    }
    return null;
  }
  /**
   * This is for CG - an app that has multiple individual components.
   * Will be placed all in one table to save space.
   */
  nonStandardTable = (data) => {
    let cols = [];
    let rows = [];
    let dc = ['ams', 'iad', 'sjc'];
    let j = 0;
    let cageNum = 1;
    let maxCols = 0;
    let name = "";
    let nextName = "";
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {

        // Check if the next server is in a different group
        if (i + 1 < data.length) {
          // Maelstrom and CG have different data
          // Check Maelstrom against dc and CG against servername
          if (this.props.name === 'Maelstrom') {
            name = data[i]._dc;
            nextName = data[i + 1]._dc;
          } else {
            name = data[i]._serverName;
            nextName = data[i + 1]._serverName;
          }
          if (name === nextName && data[i]._dc === data[i+1]._dc) {
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
    /**
     * Render the table rows and call TableBlock to draw each block
     */
    const row = _.map(_.range(rows.length), function (i) {
      return (
        <tr key={i}>
          {this.calculateNonStandardHeaderSpan(rows, i)}
          {this.headerCG(rows, i)}
          <TableBlock data={rows[i].col} />
        </tr>
      );
    }.bind(this));
    return row;
  }
  standardTable = (data) => {
    let cols = [];
    let rows = [];
    let dc = ['ams', 'iad', 'sjc'];
    let j = 0;
    let cageNum = 1;
    let rowSpan = 0; //rowSpan used for calculating the dc header
    let maxCols = 0;

    // Iterate through data list to determine table rows and columns
    for (var i = 0; i < data.length; i++) {
      //Find max columns to display the column header
      if (maxCols < data[i]._hostNum) {
        maxCols = data[i]._hostNum;
      }
      // Check dc is the same, and cage numbers are the same to determine the row
      let dcEquality = data[i]._dc.toLocaleLowerCase().valueOf() === dc[j].toLocaleLowerCase().valueOf();
      if (dcEquality === true && data[i]._cageNum === cageNum) {
        cols.push(data[i]);
        // Check the data center type. If different, increase to the next dc and restart
      } else if (dcEquality === false) {
        rowSpan = cageNum;
        j++; // next dc
        rows.push({ rowNum: cageNum, col: cols, rowSpan: rowSpan }); // new row
        cageNum = 1; // reset cageNum to 1 since it is a new dc
        cols = []; // clear columns to new row
        cols.push(data[i]);
      } else if (data[i]._cageNum === cageNum + 1 && cols.length !== 0) {
        rows.push({ rowNum: cageNum, col: cols, rowSpan: 0 }); // next row
        cageNum++;
        cols = []; // clear columns to new row
        cols.push(data[i]);
        // If there is a row being skipped
      } else {
        rows.push({ rowNum: cageNum, col: cols, rowSpan: 0 });
        while (cageNum < data[i]._cageNum) {
          cageNum++;
        }
        cols = [];
        cols.push(data[i]);
      }
      rowSpan = 0;
      if (cols.length > maxCols) {
        maxCols = cols.length
      }
    }
    rows.push({ rowNum: cageNum, col: cols, rowSpan: cageNum });
    /**
     * Render the table rows and call TableBlock to draw each block
     */
    const row = _.map(_.range(rows.length), function (i) {
      return (
        <tr key={i}>
          {this.calculateHeaderSpan(rows, i)}
          <th>{rows[i].rowNum}</th>
          <TableBlock data={rows[i].col} />
        </tr>
      );
    }.bind(this));
    return row;
  }
  render() {
    let row = [];
    // Check if the table is CG, which displays data differently
    if (this.props.name === 'CG' || this.props.name === 'Test Prod' || this.props.name === 'Maestro' || this.props.name === 'Maelstrom') {
      row = this.nonStandardTable(this.props.data);
    } else {
      row = this.standardTable(this.props.data);
    }
    return (
      <tbody>{row}</tbody>
    );
  }
}
