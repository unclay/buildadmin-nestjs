import * as crypto from 'crypto';

/**
 * md5 加密
 * @param str 字符串
 * @returns 加密后的字符串
 */
export function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 从字符串中随机获取一个字符
 * @param str 字符串
 * @returns 随机字符
 */
export function randomCharAt(str: string): string {
  return str.charAt(randomInt(0, str.length));
}

/**
 * svg 字符串转换为 base64 编码
 * @param svg svg字符串
 * @returns 
 */
export function svgToBase64(svg: string) {
  // 替换双引号为单引号，避免编码问题
  const formattedSvg = svg.replace(/"/g, "'");
  // 编码为Base64
  return `data:image/svg+xml;base64,${Buffer.from(formattedSvg).toString('base64')}`;
}

/**
 * 左trim
 * @param str 字符串
 * @param chars 要删除的字符
 * @returns 左trim后的字符串
 */
export function ltrim(str: string, chars: string = '\\s'): string {
  const pattern = chars ? `^[${chars}]+` : `^\\s+`;
  return str.replace(new RegExp(pattern), '');
}
/**
 * 右trim
 * @param str 字符串
 * @param chars 要删除的字符
 * @returns 右trim后的字符串
 */
export function rtrim(str: string, chars: string = '\\s'): string {
  const pattern = chars ? `[${chars}]+$` : `\\s+$`;
  return str.replace(new RegExp(pattern), '');
}

/**
 * 将字符串属性列表转为数组
 * @param attr 属性字符串，一行一个，无需引号，比如：class=input-class
 * @returns 属性数组
 */
export function strAttrToArray(attr: string): Record<string, any> {
  if (!attr) return {};

  // 统一换行符并分割成数组
  const attrLines = attr.replace(/\r\n/g, '\n').trim().split('\n');
  const attrTemp: Record<string, any> = {};

  for (const line of attrLines) {
    const [key, value] = line.split('=');

    if (key && value !== undefined) {
      let attrVal: string | number | boolean = value;

      // 处理布尔值
      if (value === 'false' || value === 'true') {
        attrVal = value !== 'false';
      }
      // 处理数字
      else if (!isNaN(Number(value))) {
        attrVal = parseFloat(value);
      }

      // 处理嵌套属性 (如 'a.b')
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        if (parentKey && childKey) {
          if (!attrTemp[parentKey]) {
            attrTemp[parentKey] = {};
          }
          attrTemp[parentKey][childKey] = attrVal;
          continue;
        }
      }

      attrTemp[key] = attrVal;
    }
  }

  return attrTemp;
}