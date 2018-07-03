# React-Computed
将Vue的computed功能带入到React中。轻量级别的引用

## 使用方式

### 方法一

```javascript
import React from 'react';
import Computed from './computed/index';

class App extends Computed {
  // 注意这里state不能在constructor初始
  state = {
    num: 1,
  }
  // computed初始,类似Vue.computed
  computed: {
    numAdd() {
      return this.state.num + 1;
    },
  }
  ...
}

export default App
```
这种方式继承`Computed`类,虽然`React`官方不提倡这种写法，但是目前没有发现什么异常。如果你的代码中的组件已经有继承了   
可以将Computed类里的代码拷贝过去，其实`Computed`的代码并不多

### 方法二

```javascript
import React from 'react';
import Computed from './computed/computed';

class App extends React.Component {
  // 注意这里state不能在constructor初始
  state = {
    num: 1,
  };
  // Computed类的实例
  _computed = null;

  constructor(props) {
    super(props);
    // 初始化
    this._computed = new Computed(params, this);
  }

  componentDidUpdate(preProps, preState) {
    this._computed.observerState(preState);
  }
  ...
}

export default App
```
这种方法并不依赖继承，但是要引入的代码比第一种多一些。在`componentDidUpdate`中处理，是因为考虑到`React 16.3.0`  
之后会对部分生命周期进行调整，而且`React`似乎不能对`this.state`进行`Object.defineProperty`。在`new Computed(...)`  
过程中会初始化`App`的`this.computed`的值。


[React v16.3升级日志](https://doc.react-china.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes)
