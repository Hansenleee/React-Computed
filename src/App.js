import React from 'react';
import logo from './logo.svg';
import './App.css';
import Computed from './computed/index';

class App extends Computed {
  state = {
    num: 1,
  };
  computed = this.createComputed({
    numAdd() {
      return this.state.num + 1
    }
  });

  componentDidMount() {
    setTimeout(() => {
      this.setState({ num: 2})
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.computed.numAdd}</h1>
        </header>
      </div>
    );
  }
}

export default App;
