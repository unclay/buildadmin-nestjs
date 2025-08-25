/**
 * 字符串命名风格转换
 * @param {string} name 要转换的字符串
 * @param {boolean} ucfirst 是否首字母大写
 * @param {string} separator 分隔符，默认为下划线
 * @return {string}
 */
export function parse_name(name, ucfirst = true, separator = '_') {
    if (!name || typeof name !== 'string') {
        return name;
    }

    // 判断是否是驼峰命名（包含大写字母）
    const isCamelCase = /[A-Z]/.test(name);

    if (isCamelCase) {
        // 驼峰转下划线
        let result = name.replace(/([A-Z])/g, `${separator}$1`).toLowerCase();

        // 去除开头可能多余的分隔符
        if (result.startsWith(separator)) {
            result = result.substring(separator.length);
        }

        return result;
    } else {
        // 下划线转驼峰
        let result = name.replace(new RegExp(`${separator}([a-zA-Z])`, 'g'), (_, char) => {
            return char.toUpperCase();
        });

        // 处理首字母
        if (ucfirst) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        } else {
            result = result.charAt(0).toLowerCase() + result.slice(1);
        }

        return result;
    }
}

// 添加别名函数，保持与 ThinkPHP 一致的调用方式
parse_name.ucfirst = function (name, separator = '_') {
    return parse_name(name, true, separator);
};

parse_name.lcfirst = function (name, separator = '_') {
    return parse_name(name, false, separator);
};