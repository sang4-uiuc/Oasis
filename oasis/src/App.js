import React, { Component } from 'react';
var _ = require('lodash');
import Header from './Components/Header';
import Card from './Components/CardViews/Card';
import LoadingComponent from './LoadingComponent';
import DataParser from './Components/DataParser';
import './App.css';
import 'whatwg-fetch'; // Fetch lib
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/**
 * App class is the root of the application, which renders the other classes
 * 
 * @author Kathryn Ager & Thomas Sang
 */
let data = [];
// let data = [
//   { name: 'DMA', data: [new Data('dtams12dma01p', 'AMS', 1, 11, 'Running', 1.2, 1111),new Data('dtiad12dma01p', 'IAD', 1, 11, 'Running', 1.2, 1111), new Data('dtams01dma01p', 'IAD', 1, 11, 'Cannot contact App HTTP', 1.2, 1111), new Data('dtiad11dma01p', 'IAD', 2, 11, 'Cannot contact App HTTP', 1.2, 1111), new Data('dtiad03dma01p', 'IAD', 3, 11, 'Cannot contact App HTTP', 1.2, 1111), new Data('dtsjc02dma01p', 'IAD', 4, 11, 'Cannot contact App HTTP', 1.2, 1111)] },
//   { name: 'Biddy', data: [new Data('dtiad12rtb01p', 'AMS', 1, 11, 'Running', 1.2, 1111), new Data('dtiad10rtb01p', 'IAD', 1, 11, 'Cannot contact App HTTP', 1.2, 1111), new Data('dtiad12rtb05p', 'SJC', 1, 11, 'Running', 1.2, 1111), new Data('dtams01rtb01p', 'SJC', 1, 11, 'Running', 1.2, 1111)] },
//   { name: 'Nessy', data: [new Data('Nessy', 'AMS', 1, 11, 'Running', 1.2, 1111)] },
//   { name: 'Bessy', data: [new Data('Bessy', 'AMS', 1, 11, 'Running', 1.2, 1111)] },
//   { name: 'Flume', data: [new Data('Flume', 'AMS', 1, 11, 'Running', 1.2, 1111)] },
//   { name: 'Mems', data: [new Data('Mems', 'AMS', 1, 11, 'Running', 1.2, 1111)] },
//   { name: 'Sasquatch', data: [new Data('Sasquatch', 'AMS', 1, 11, 'Running', 1.2, 1111)] }];

/**
 * App class is the entry point, which renders the necessary classes.
 * 
 */
class App extends Component {
  constructor() {
    super();
    this.state = {
      data: data,
      showKey: true,
      showAlerts: false
    };
    this.setDataState = this.setDataState.bind(this);
  }
  /**
   * Set the state with the new data that was read in. Set state calls a rerender.
   * @param {* Data from DataParser} dataReceived 
   * @param {*} callback 
   */
  setDataState(dataReceived, callback) {
    this.setState(dataReceived, callback);
  }
  render() {
    const loading = this.state.data.length === 0;
    return (
      <MuiThemeProvider >
        <div className="App">
          <DataParser dataState={this.setDataState} />
          <Header 
            showKey={this.state.showKey}
            showAlerts={this.state.showAlerts} />
          {loading
            ? <LoadingComponent />
            : <Card
              data={this.state.data}
              isResizable={false}
              setLayoutState={this.setDataState}
              rowHeight={4}
            />
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
