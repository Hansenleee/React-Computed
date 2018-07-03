/**
 * 处理computed依赖关系
 * 1：this.computed依赖this.state
 * 2: this.computed依赖其他this.computed下的值、互相依赖
 * 3: 包括以上两种情况
 */

// 依赖于state的computed值，例如{ num: numAdd } 表示this.computed.numAdd依赖于this.state.num
let dependOnState = {}
// 雨来于computed的computed，例如{ nums: numAdd } 表示this.computed.numAdd依赖于this.computed.nums
let dependOnComputed = {}
// 表示正在计算的computed的key
// 同一时间只能有一个在计算,表示正在计算的computed对象下的key
let onCalcuatingComputedName = ''
const hasOwn = Object.prototype.hasOwnProperty;

/**
 * 监听state
 */
function defineState (state) {
  Object.entries(state).forEach(([key, value]) => {

    Object.defineProperty(state, key, {
      get: () => {
        addDepend(key, dependOnState);

        return value
      }
    });
  });
}

/**
* 监听computed
*/
function defineComputed(_this) {
  const computedParam = _this._computedParams;
  const computed = _this.computed;

  Object.entries(computedParam).forEach(([key, value]) => {

    Object.defineProperty(_this.componetComputed, key, {
      get: () => {
        addDepend(key, dependOnComputed);
        // 当组件内部的computed引用器统一级的computed时，先判断被引用的computed是否有值
        if (hasOwn.call(computed, key)) {
          return computed[key];
        }
        // 如果被引用的computed还没计算，需要先计算被引用的computed
        return typeof value === 'function' ? value.call(_this) : value;
      },
      set: (val) => {
        const computeds = dependOnComputed[key];

        if (Array.isArray(computeds) && computeds.length > 0) {
          _this.triggerComputed(computeds);
        }

        return val;
      },
    });
  });
}

/**
 * 加入依赖
 */
function addDepend(targetKey, depends) {
  // 如果存在正在计算的computed
  if (!onCalcuatingComputedName) {
    return;
  }

  const computeds = depends[targetKey];

  if (computeds) {
    if (computeds.indexOf(onCalcuatingComputedName) === -1) {
      computeds.push(onCalcuatingComputedName);
    }
  } else {
    depends[targetKey] = [onCalcuatingComputedName];
  }
}

export default {
  /**
   * 初始配置依赖关系
   */
  initDepend(_this) {
    dependOnState = {};
    dependOnComputed = {};

    defineState(_this._this.state);
    defineComputed(_this);
  },
  /**
   * 获取依赖
   */
  getDepend() {
    return {
      dependOnState,
      dependOnComputed,
    }
  },
  /**
   * 设置onCalcuatingComputedName
   */
  setOnCalcuatingCopmuted(key) {
    onCalcuatingComputedName = key;
  },
  /**
   * 获取onCalcuatingComputedName
   */
  getOnCalcuatingCopmuted(key) {
    return onCalcuatingComputedName;
  },
}
