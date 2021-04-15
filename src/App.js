import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LDClient from 'ldclient-js'

const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedSortOrder: null
    }
  }
  componentDidMount() {
    //create a user object for specific users in the future 
    const user = {
      key: 'testing'
    }
    this.ldclient = LDClient.initialize('6077cd2ca793ec0bac0a3a91', user)
    this.ldclient.on('ready', this.onLaunchDarklyUpdated.bind(this))
    this.ldclient.on('change', this.onLaunchDarklyUpdated.bind(this))
  }
  onLaunchDarklyUpdated() {
    //set the state of the flag variation from LaunchDarkly 
    this.setState({
      featureFlags: {
        defaultIsAdded: this.ldclient.variation('testing-sort-app')
      }
    })
  }
  render() {
    //if feature flags are not loaded yet, display loading
    if (!this.state.featureFlags) {
      return <div className="App">Loading....</div>
    }

    let sorter
    // allow the user to assign sorter as the new
    if (this.state.selectedSortOrder) {
      if (this.state.selectedSortOrder === 'added') {
        sorter = isNewer
      } else if (this.state.selectedSortOrder === 'natural') {
        sorter = undefined
      }
    } 
    // use LaunchDarkly to asign the sorter based on the feature flag
    else {
      if (this.state.featureFlags.defaultIsAdded) {
        sorter = isNewer
      } else {
        sorter = undefined
      }
    }
    return (
      <div className="testing">
        <div
            style={{ fontWeight: sorter === undefined ? 'bold' : 'normal'}}
            onClick={() => this.setState({ selectedSortOrder: 'natural' })}>Feature One</div>
        <div
          style={{ fontWeight: sorter === isNewer ? 'bold' : 'normal'}}
          onClick={() => this.setState({ selectedSortOrder: 'added' })}>Feature Two</div>
      
      </div>
    );
  }
}

export default App;
