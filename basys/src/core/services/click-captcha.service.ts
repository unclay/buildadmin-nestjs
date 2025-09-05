import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as svgCaptcha from 'svg-captcha';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { BuildAdminConfig, ClickCaptchaConfig } from '../../config/index.types';

interface ClickCaptchaData {
  id: string;
  text: string[];
  base64: string;
  width: number;
  height: number;
}

interface ClickPoint {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
}

/**
 * 点选验证码服务 - 基于SVG实现
 */
@Injectable()
export class CoreClickCaptchaService {
  private readonly width = 300; // 验证码图片宽度
  private readonly height = 150; // 验证码图片高度
  private readonly tolerance = 15; // 点击位置容差范围(像素)
  private readonly expireTime = 600; // 验证码过期时间(秒) - 10分钟

  /**
   * 验证码配置
   */
  private config: ClickCaptchaConfig = {
    // 透明度
    alpha: 36,
    // 中文字符集
    zhSet: '们以我到他会作时要动国产的是工就年阶义发成部民可出能方进在和有大这主中为来分生对于学级地用同行面说种过命度革而多子后自社加小机也经力线本电高量长党得实家定深法表着水理化争现所起政好十战无农使前等反体合斗路图把结第里正新开论之物从当两些还天资事队点育重其思与间内去因件利相由压员气业代全组数果期导平各基或月然如应形想制心样都向变关问比展那它最及外没看治提五解系林者米群头意只明四道马认次文通但条较克又公孔领军流接席位情运器并飞原油放立题质指建区验活众很教决特此常石强极已根共直团统式转别造切九你取西持总料连任志观调么山程百报更见必真保热委手改管处己将修支识象先老光专什六型具示复安带每东增则完风回南劳轮科北打积车计给节做务被整联步类集号列温装即毫知轴研单坚据速防史拉世设达尔场织历花求传断况采精金界品判参层止边清至万确究书术状须离再目海权且青才证低越际八试规斯近注办布门铁需走议县兵固除般引齿胜细影济白格效置推空配叶率述今选养德话查差半敌始片施响收华觉备名红续均药标记难存测身紧液派准斤角降维板许破述技消底床田势端感往神便贺村构照容非亚磨族段算适讲按值美态易彪服早班麦削信排台声该击素张密害侯何树肥继右属市严径螺检左页抗苏显苦英快称坏移巴材省黑武培著河帝仅针怎植京助升王眼她抓苗副杂普谈围食源例致酸旧却充足短划剂宣环落首尺波承粉践府鱼随考刻靠够满夫失包住促枝局菌杆周护岩师举曲春元超负砂封换太模贫减阳扬江析亩木言球朝医校古呢稻宋听唯输滑站另卫字鼓刚写刘微略范供阿块某功友限项余倒卷创律雨让骨远帮初皮播优占圈伟季训控激找叫云互跟粮粒母练塞钢顶策双留误础阻故寸盾晚丝女散焊功株亲院冷彻弹错散商视艺版烈零室轻倍缺厘泵察绝富城冲喷壤简否柱李望盘磁雄似困巩益洲脱投送侧润盖挥距触星松送获兴独官混纪依未突架宽冬章偏纹吃执阀矿寨责熟稳夺硬价努翻奇甲预职评读背协损棉侵灰虽矛厚罗泥辟告箱掌氧恩爱停曾溶营终纲孟钱待尽俄缩沙退陈讨奋械载胞哪旋征槽倒握担仍呀鲜吧卡粗介钻逐弱脚怕盐末丰雾冠丙街莱贝辐肠付吉渗瑞惊顿挤秒悬姆森糖圣凹陶词迟蚕亿矩康遵牧遭幅园腔订香肉弟屋敏恢忘编印蜂急拿扩飞露核缘游振操央伍域甚迅辉异序免纸夜乡久隶念兰映沟乙吗儒汽磷艰晶埃燃欢铁补咱芽永瓦倾阵碳演威附牙芽永瓦斜灌欧献顺猪洋腐请透司括脉宜笑若尾束壮暴企菜穗楚汉愈绿拖牛份染既秋遍锻玉夏疗尖井费州访吹荣铜沿替滚客召旱悟刺脑措贯藏敢令隙炉壳硫煤迎铸粘探临薄旬善福纵择礼愿伏残雷延烟句纯渐耕跑泽慢栽鲁赤繁境潮横掉锥希池败船假亮谓托伙哲怀摆贡呈劲财仪沉炼麻祖息车穿货销齐鼠抽画饲龙库守筑房歌寒喜哥洗蚀废纳腹乎录镜脂庄擦险赞钟摇典柄辩竹谷乱虚桥奥伯赶垂途额壁网截野遗静谋弄挂课镇妄盛耐扎虑键归符庆聚绕摩忙舞遇索顾胶羊湖钉仁音迹碎伸灯避泛答勇频皇柳哈揭甘诺概宪浓岛袭谁洪谢炮浇斑讯懂灵蛋闭孩释巨徒私银伊景坦累匀霉杜乐勒隔弯绩招绍胡呼峰零柴簧午跳居尚秦稍追梁折耗碱殊岗挖氏刃剧堆赫荷胸衡勤膜篇登驻案刊秧缓凸役剪川雪链渔啦脸户洛孢勃盟买杨宗焦赛旗滤硅炭股坐蒸凝竟枪黎救冒暗洞犯筒您宋弧爆谬涂味津臂障褐陆啊健尊豆拔莫抵桑坡缝警挑冰柬嘴啥饭塑寄赵喊垫丹渡耳虎笔稀昆浪萨茶滴浅拥覆伦娘吨浸袖珠雌妈紫戏塔锤震岁貌洁剖牢锋疑霸闪埔猛诉刷忽闹乔唐漏闻沈熔氯荒茎男凡抢像浆旁玻亦忠唱蒙予纷捕锁尤乘乌智淡允叛畜俘摸锈扫毕璃宝芯爷鉴秘净蒋钙肩腾枯抛轨堂拌爸循诱祝励肯酒绳塘燥泡袋朗喂铝软渠颗惯贸综墙趋彼届墨碍启逆卸航衣孙龄岭休借',
  };

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
    const clickConfig = this.configService.get<BuildAdminConfig>('buildadmin').click_captcha;
    this.config = {
      ...this.config,
      ...clickConfig,
    };
    // 清理过期的验证码
    this.cleanExpiredCaptcha();
  }

  /**
   * 清理过期的验证码
   */
  private async cleanExpiredCaptcha(): Promise<void> {
    const now = new Date();
    await this.prisma.baCaptcha.deleteMany({
      where: {
        expire_time: {
          lt: now,
        },
      },
    });
  }

  /**
   * 创建点选验证码
   * @param id 验证码ID
   * @returns 返回验证码数据
   */
  async create(id: string): Promise<ClickCaptchaData> {
    // 生成随机文字点位
    const points = this.generateRandomPoints();

    // 使用svg-captcha生成基础SVG背景
    const baseCaptcha = svgCaptcha.create({
      size: 6,
      ignoreChars: '0o1il',
      noise: 3,
      color: true,
      background: '#f8f9fa',
      width: this.width,
      height: this.height,
      fontSize: 20,
    });

    // 修改SVG内容，添加点选文字
    let svgContent = baseCaptcha.data;

    // 移除SVG结束标签，准备添加点位
    svgContent = svgContent.replace('</svg>', '');

    // 添加背景矩形
    svgContent += `<rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#f8f9fa" fill-opacity="0.8"/>`;

    // 添加干扰线
    for (let i = 0; i < 8; i++) {
      const x1 = Math.random() * this.width;
      const y1 = Math.random() * this.height;
      const x2 = Math.random() * this.width;
      const y2 = Math.random() * this.height;
      const color = this.getRandomColor();
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.3"/>`;
    }

    // 添加点选文字
    const textElements: string[] = [];
    points.forEach((point, index) => {
      const color = this.getRandomColor();
      const fontSize = 16 + Math.random() * 8; // 16-24px
      const rotation = (Math.random() - 0.5) * 30; // -15到15度旋转

      svgContent += `<text x="${point.x}" y="${point.y}" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${color}" font-weight="bold" transform="rotate(${rotation} ${point.x} ${point.y})">${point.text}</text>`;

      // 只有前pointCount个是需要点击的
      if (index < this.config.length) {
        textElements.push(point.text);
      }
    });

    // 添加一些装饰圆点
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const r = 1 + Math.random() * 3;
      const color = this.getRandomColor();
      svgContent += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.4"/>`;
    }

    // 重新添加SVG结束标签
    svgContent += '</svg>';

    // 转换为base64
    const base64 = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

    const nowTime = new Date();
    const expireTime = new Date(Date.now() + this.expireTime * 1000);
    const key = crypto.createHash('md5').update(id).digest('hex');
    const code = crypto.createHash('md5').update(textElements.join(',')).digest('hex');

    // 保存到数据库
    const captchaData = {
      text: points.slice(0, this.config.length),
      width: this.width,
      height: this.height,
    };

    await this.prisma.baCaptcha.upsert({
      where: { key },
      update: {
        code,
        captcha: JSON.stringify(captchaData),
        create_time: nowTime,
        expire_time: expireTime,
      },
      create: {
        key,
        code,
        captcha: JSON.stringify(captchaData),
        create_time: nowTime,
        expire_time: expireTime,
      },
    });

    return {
      id,
      text: textElements,
      base64,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * 检查验证码
   * @param id 验证码ID
   * @param info 点击信息 格式: "x1,y1-x2,y2-x3,y3;width;height"
   * @param unset 验证成功是否删除验证码
   * @returns 验证结果
   */
  async check(id: string, info: string, unset: boolean = true): Promise<boolean> {
    const key = crypto.createHash('md5').update(id).digest('hex');
    const captcha = await this.prisma.baCaptcha.findUnique({
      where: { key },
    });

    if (!captcha) {
      return false;
    }

    // 验证码过期
    const now = new Date();
    if (now > captcha.expire_time) {
      await this.prisma.baCaptcha.delete({ where: { key } });
      return false;
    }

    const captchaData = JSON.parse(captcha.captcha);
    const [xy, w, h] = info.split(';');
    const xyArr = xy.split('-');
    const xPro = parseInt(w) / captchaData.width; // 宽度比例
    const yPro = parseInt(h) / captchaData.height; // 高度比例

    // 检查点击点数是否正确
    if (xyArr.length !== this.config.length) {
      return false;
    }

    // 检查每个点击位置
    for (let k = 0; k < xyArr.length; k++) {
      const [x, y] = xyArr[k].split(',').map(Number);
      const textItem = captchaData.text[k];

      // 计算实际坐标
      const actualX = x / xPro;
      const actualY = y / yPro;

      // 检查是否在容差范围内
      const distance = Math.sqrt(
        Math.pow(actualX - textItem.x, 2) + Math.pow(actualY - textItem.y, 2)
      );

      if (distance > this.tolerance) {
        return false;
      }
    }

    if (unset) {
      await this.prisma.baCaptcha.delete({ where: { key } });
    }

    return true;
  }

  /**
   * 生成随机点位
   */
  private generateRandomPoints(): ClickPoint[] {
    const points: ClickPoint[] = [];
    const totalPoints = this.config.length + this.config.confuse_length;
    const margin = 30;

    for (let i = 0; i < totalPoints; i++) {
      let point: ClickPoint;
      let attempts = 0;

      do {
        const randomChar = this.config.zhSet.charAt(Math.floor(Math.random() * this.config.zhSet.length));
        point = {
          x: margin + Math.random() * (this.width - 2 * margin),
          y: margin + Math.random() * (this.height - 2 * margin),
          text: randomChar,
          width: 20,
          height: 20,
        };
        attempts++;
      } while (this.isTooClose(point, points) && attempts < 50);

      points.push(point);
    }

    return points;
  }

  /**
   * 检查点位是否太近
   */
  private isTooClose(point: ClickPoint, existingPoints: ClickPoint[]): boolean {
    const minDistance = 40;

    return existingPoints.some(existing => {
      const distance = Math.sqrt(
        Math.pow(point.x - existing.x, 2) + Math.pow(point.y - existing.y, 2)
      );
      return distance < minDistance;
    });
  }

  /**
   * 获取随机颜色
   */
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}