// 元素唯一
export function array_unique(arr: any[]) {
    return [...new Set(arr)];
}
// 差集
export function array_diff(mainArray, ...diffArrays) {
    const diffSet = new Set([].concat(...diffArrays));
    return mainArray.filter(item => !diffSet.has(item));
}