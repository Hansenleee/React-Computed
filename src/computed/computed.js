class Computed {
  // 记录原始的computed值
  _computedParams = null;
  // 记录原始的作用域
  _this = null;
  // computed的值
  computed = {}
  // 依赖映射关系
  dependMap = {}
  // 同一时间只能有一个在计算,表示正在计算的computed对象下的key
  onCalcuatingComputedName = ''
  /**
   * 构造器
   */
  constructor(params, _this) {
    // 只支持对象格式
    if (typeof params !== 'object') {
      return;
    }
    this._computedParams = params;
    this._this = _this;
    this.createComputed();
  }

  /**
   * 创建computed
   * @param {Object} params - 是个对象，使用方式和Vue.computed一致
   * @param {Object} _this - 当前组件的实例
   */
  createComputed() {
    const computed = {};
    // 监听state
    this.defineState();
    // 遍历
    Object.entries(this._computedParams).forEach(([key, value]) => {
      this.onCalcuatingComputedName = key;
      computed[key] = typeof value === 'function' ? value.call(this._this) : value;
    });

    this.computed = computed;
  }

  /**
   * 监听state变化
   */
  observerState(nextState) {
    const state = this._this.state;
    const dependMap = this.dependMap;
    const computedList = [];
    const needRecalculateStates = [];

    Object.entries(nextState).forEach(([key, nextValue]) => {
      const nowValue = state[key];

      if (nextValue !== nowValue) {
        // 对应的state发生改变，查找依赖当前state的computed
        const computeds = dependMap[key];
        // computed依赖的state改变后，触发computed重新计算
        computedList.push(computeds);
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
    this.triggerComputed(needRecalculateStates).then(() => {
      // 强制重新渲染render
      this._this.forceUpdate();
    })
  }

  /**
   * 监听state
   */
  defineState() {
    const state = this._this.state;

    Object.entries(state).forEach(([key, value]) => {
      // 监听下
      Object.defineProperty(state, key, {
        get: () => {
          const computedKey = this.onCalcuatingComputedName
          
          if (computedKey) {
            this.addDepend(key, computedKey);
          }

          return value;
        },
      })
    });
  }

  /**
   * 加入依赖
   */
  addDepend(stateKey, computedKey) {
    const dependMap = this.dependMap;

    if (dependMap[stateKey]) {
      if (dependMap[stateKey].indexOf(computedKey) === -1) {
        dependMap[stateKey].push(computedKey);
      }
    } else {
      dependMap[stateKey] = [computedKey];
    }
  }

  /**
   * 触发computed重新计算
   */
  triggerComputed(computeds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.calculate(computeds);
        resolve();
      }, 50);
    })
  }

  /**
   * 计算computed值
   */
  calculate(computeds) {
    computeds.forEach((key) => {
      const value = this._computedParams[key];

      this.computed[key] = typeof value === 'function' ? value.call(this._this) : value;
    });
  }

  /**
   * 获取computed
   */
  getComputed() {
    return this.computed;
  }
}

export default Computed;