/**
 * Computed入口类，主要的功能入口
 */

import depend from './utils/depend';

class Computed {
  /**
   * 构造器
   */
  constructor(params, _this) {
    // 只支持对象格式
    if (typeof params !== 'object') {
      return;
    }
    // 记录原始的computed值
    this._computedParams = params;
    // 记录原始的作用域
    this._this = _this;
    // computed的计算值
    this.computed = {} = {}
    // 组件Component下的computed值，进行definePropery
    // 可以算是组件的computed一个拷贝
    this.componetComputed = {}
    this._this.computed = this.componetComputed;
    this.createComputed();
  }

  /**
   * 创建computed
   * @param {Object} params - 是个对象，使用方式和Vue.computed一致
   * @param {Object} _this - 当前组件的实例
   */
  createComputed() {
    // 初始化依赖的关系
    depend.initDepend(this);
    // 计算computed初始值
    this.triggerComputed(Object.keys(this._computedParams));
  }

  /**
   * 监听state变化
   */
  observerState(preState) {
    const state = this._this.state;
    const dependMap = depend.getDepend();
    const computedList = [];
    const needRecalculateStates = [];

    // 根据前后修改的state查找出被依赖的computed
    Object.entries(state).forEach(([key, value]) => {
      const preValue = preState[key];

      if (value !== preValue) {
        // 对应的state发生改变，查找依赖当前state的computed
        const computedsfromState = dependMap.dependOnState[key]
        // computed依赖的state改变后，触发computed重新计算
        if (!!computedsfromState) {
          computedList.push(computedsfromState);
        }
      }
    });

    // 合并去除重复的。因为一个computed可能依赖多多个state、重新计算时，只需要计算一次就可
    computedList.forEach((keys) => {
      keys.forEach((key) => {
        if (needRecalculateStates.indexOf(key) === -1) {
          needRecalculateStates.push(key);
        }
      })
    })

    // 重新计算
    if (needRecalculateStates.length > 0) {
      this.triggerComputed(needRecalculateStates);
      // 赋值
      // this.setComputedToComponent();
      // 强制重新渲染render
      this._this.forceUpdate();
    }
  }

  /**
   * 计算computed值
   * @param {Array} computeds - computed的key的数组
   */
  triggerComputed(computeds) {
    computeds.forEach((key) => {
      const value = this._computedParams[key];

      // 设置depend的正在计算的值
      depend.setOnCalcuatingCopmuted(key);
      // 计算,这里其实不需要对this.componetComputed进行赋值
      // 但是为了触发设置在this.componetComputed上的set（来判断依赖的更新），必须赋值一次，
      // 这里需要找到好方法来解决目前this.componetComputed和this.computed混乱的关系
      this.componetComputed[key] = this.computed[key] = typeof value === 'function' ? value.call(this._this) : value;
      // 置空
      depend.setOnCalcuatingCopmuted('');
    });
  }
}

export default Computed;