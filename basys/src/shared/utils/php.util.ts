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