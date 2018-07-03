/**
 * 数组的filter功能改造
 * @param {Array} list - 需要过滤的数组
 * @param {Function} f - 过滤条件
 * @return {Any} 返回匹配条件下的第一个元素
 */
function find(list, f) {
  return list.filter(f)[0];
}

/**
 * 深度赋值功能
 * 赋值时如果出现对象的无限循环，立即终止，直接返回
 * @param {Object|Array} obj - 赋值元素
 * @param {Array} cache - 判断对象是否循环
 * @return {Object|Array} 返回深度赋值后的结果
 */
export function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const hit = find(cache, (c) => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}
