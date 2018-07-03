import { Component } from 'react';
import Computed from './computed';

class ReactComputed extends Component {
  _computed = null;
  /**
   * 创建computed
   * @param {Object} params - 是个对象，使用方式和Vue.computed一致
   * @param {Object} _this - 当前组件的实例
   */
  createComputed(params, _this) {
    this._computed = new Computed(params, _this || this);

    return this._computed.componetComputed;
  }

  componentDidUpdate(preProps, preState) {
    this._computed.observerState(preState);
  }
}

export default ReactComputed;