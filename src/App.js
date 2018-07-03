import React from 'react';
import logo from './logo.svg';
import './App.css';
import Computed from './computed/index';

class App extends Computed {
  state = {
    num: 0,
  };
  computed = this.createComputed({
    nums() {
      return this.state.num || 0
    },
    numAdd() {
      return this.computed.nums + 1
    },
  });

  componentDidMount() {
    setTimeout(() => {
      this.setState({ num: 1 })
    }, 1000);
  }

  render() {
    const computed = this.computed;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">numAdd: {computed.numAdd}  nums: {computed.nums}</h1>
          <p>{this.state.num}</p>
        </header>
      </div>
    );
  }
}

export default App;
