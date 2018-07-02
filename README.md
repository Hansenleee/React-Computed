# React-Computed
将Vue的computed功能带入到React中。轻量级别的引用

## 使用方式

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
当`state`层级比较深时，考虑优化遍历方式。最后可以通过建议升级到React v16.3.0

[React v16.3升级日志](https://doc.react-china.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes)
