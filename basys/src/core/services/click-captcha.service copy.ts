import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { PrismaService } from '../database';
import { md5, svgToBase64 } from '../../shared';
import { ConfigService } from '@nestjs/config';
import { BuildAdminConfig } from '../../config/index.types';

@Injectable()
export class CoreClickCaptchaService {
  private expire = 600; // 验证码过期时间(s)

  private bgColors = [
    '#F5F5F5', '#E8E8E8', '#F0F0F0' // Simple background colors instead of images
  ];

  private iconDict = {
    'aeroplane': '飞机',
    'apple': '苹果',
    'banana': '香蕉',
    'bell': '铃铛',
    'bicycle': '自行车',
    'bird': '小鸟',
    'bomb': '炸弹',
    'butterfly': '蝴蝶',
    'candy': '糖果',
    'crab': '螃蟹',
    'cup': '杯子',
    'dolphin': '海豚',
    'fire': '火',
    'guitar': '吉他',
    'hexagon': '六角形',
    'pear': '梨',
    'rocket': '火箭',
    'sailboat': '帆船',
    'snowflake': '雪花',
    'wolf head': '狼头',
  };

  private config = {
    alpha: 0.36, // Opacity (0-1)
    zhSet: '们以我到他会作时要动国产的是工就年阶义发成部民可出能方进在和有大这主中为来分生对于学级地用同行面说种过命度革而多子后自社加小机也经力线本电高量长党得实家定深法表着水理化争现所起政好十战无农使前等反体合斗路图把结第里正新开论之物从当两些还天资事队点育重其思与间内去因件利相由压员气业代全组数果期导平各基或月然如应形想制心样都向变关问比展那它最及外没看治提五解系林者米群头意只明四道马认次文通但条较克又公孔领军流接席位情运器并飞原油放立题质指建区验活众很教决特此常石强极已根共直团统式转别造切九你取西持总料连任志观调么山程百报更见必真保热委手改管处己将修支识象先老光专什六型具示复安带每东增则完风回南劳轮科北打积车计给节做务被整联步类集号列温装即毫知轴研单坚据速防史拉世设达尔场织历花求传断况采精金界品判参层止边清至万确究书术状须离再目海权且青才证低越际八试规斯近注办布门铁需走议县兵固除般引齿胜细影济白格效置推空配叶率述今选养德话查差半敌始片施响收华觉备名红续均药标记难存测身紧液派准斤角降维板许破述技消底床田势端感往神便贺村构照容非亚磨族段算适讲按值美态易彪服早班麦削信排台声该击素张密害侯何树肥继右属市严径螺检左页抗苏显苦英快称坏移巴材省黑武培著河帝仅针怎植京助升王眼她抓苗副杂普谈围食源例致酸旧却充足短划剂宣环落首尺波承粉践府鱼随考刻靠够满夫失包住促枝局菌杆周护岩师举曲春元超负砂封换太模贫减阳扬江析亩木言球朝医校古呢稻宋听唯输滑站另卫字鼓刚写刘微略范供阿块某功友限项余倒卷创律雨让骨远帮初皮播优占圈伟季训控激找叫云互跟粮粒母练塞钢顶策双留误础阻故寸盾晚丝女散焊功株亲院冷彻弹错散商视艺版烈零室轻倍缺厘泵察绝富城冲喷壤简否柱李望盘磁雄似困巩益洲脱投送侧润盖挥距触星松送获兴独官混纪依未突架宽冬章偏纹吃执阀矿寨责熟稳夺硬价努翻奇甲预职评读背协损棉侵灰虽矛厚罗泥辟告箱掌氧恩爱停曾溶营终纲孟钱待尽俄缩沙退陈讨奋械载胞哪旋征槽倒握担仍呀鲜吧卡粗介钻逐弱脚怕盐末丰雾冠丙街莱贝辐肠付吉渗瑞惊顿挤秒悬姆森糖圣凹陶词迟蚕亿矩康遵牧遭幅园腔订香肉弟屋敏恢忘编印蜂急拿扩飞露核缘游振操央伍域甚迅辉异序免纸夜乡久隶念兰映沟乙吗儒汽磷艰晶埃燃欢铁补咱芽永瓦倾阵碳演威附牙芽永瓦斜灌欧献顺猪洋腐请透司括脉宜笑若尾束壮暴企菜穗楚汉愈绿拖牛份染既秋遍锻玉夏疗尖井费州访吹荣铜沿替滚客召旱悟刺脑措贯藏敢令隙炉壳硫煤迎铸粘探临薄旬善福纵择礼愿伏残雷延烟句纯渐耕跑泽慢栽鲁赤繁境潮横掉锥希池败船假亮谓托伙哲怀摆贡呈劲财仪沉炼麻祖息车穿货销齐鼠抽画饲龙库守筑房歌寒喜哥洗蚀废纳腹乎录镜脂庄擦险赞钟摇典柄辩竹谷乱虚桥奥伯赶垂途额壁网截野遗静谋弄挂课镇妄盛耐扎虑键归符庆聚绕摩忙舞遇索顾胶羊湖钉仁音迹碎伸灯避泛答勇频皇柳哈揭甘诺概宪浓岛袭谁洪谢炮浇斑讯懂灵蛋闭孩释巨徒私银伊景坦累匀霉杜乐勒隔弯绩招绍胡呼峰零柴簧午跳居尚秦稍追梁折耗碱殊岗挖氏刃剧堆赫荷胸衡勤膜篇登驻案刊秧缓凸役剪川雪链渔啦脸户洛孢勃盟买杨宗焦赛旗滤硅炭股坐蒸凝竟枪黎救冒暗洞犯筒您宋弧爆谬涂味津臂障褐陆啊健尊豆拔莫抵桑坡缝警挑冰柬嘴啥饭塑寄赵喊垫丹渡耳虎笔稀昆浪萨茶滴浅拥覆伦娘吨浸袖珠雌妈紫戏塔锤震岁貌洁剖牢锋疑霸闪埔猛诉刷忽闹乔唐漏闻沈熔氯荒茎男凡抢像浆旁玻亦忠唱蒙予纷捕锁尤乘乌智淡允叛畜俘摸锈扫毕璃宝芯爷鉴秘净蒋钙肩腾枯抛轨堂拌爸循诱祝励肯酒绳塘燥泡袋朗喂铝软渠颗惯贸综墙趋彼届墨碍启逆卸航衣孙龄岭休借',
    length: undefined,
    confuse_length: undefined,
    mode: undefined,
    width: 300, // SVG width
    height: 150, // SVG height
    fontSize: 30, // Base font size
    noise: 3, // Number of noise lines
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const clickConfig = this.configService.get<BuildAdminConfig>('buildadmin').click_captcha;
    this.config = {
      ...this.config,
      ...clickConfig,
    };
    // Clean expired captchas
    this.cleanExpiredCaptchas();
  }

  private async cleanExpiredCaptchas() {
    // 清理过期的验证码
    await this.prisma.baCaptcha.deleteMany({
      where: {
        expire_time: {
          lt: new Date()
        }
      }
    });
  }

  async create(id: string): Promise<any> {
    const bgColor = this.bgColors[Math.floor(Math.random() * this.bgColors.length)];
    const randPoints = this.randPoints(this.config.length + this.config.confuse_length);
    const textArr: any = { text: [] };
    const text: string[] = [];

    // Generate SVG captcha
    const captcha = svgCaptcha.create({
      size: this.config.length + this.config.confuse_length,
      ignoreChars: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      noise: this.config.noise,
      color: true,
      background: bgColor,
      width: this.config.width,
      height: this.config.height,
    });

    // Prepare text items
    for (const point of randPoints) {
      const size = Math.floor(Math.random() * 10) + this.config.fontSize - 5;
      const tmp: any = { size };

      if (this.iconDict[point]) {
        // Icon
        tmp.icon = true;
        tmp.name = point;
        tmp.text = `<${this.iconDict[point]}>`;
        tmp.width = 30; // Approximate icon width
        tmp.height = 30; // Approximate icon height
      } else {
        // Text
        tmp.icon = false;
        tmp.text = point;
        tmp.width = size * tmp.text.length * 0.6; // Approximate text width
        tmp.height = size * 1.2; // Approximate text height
      }

      textArr.text.push(tmp);
    }

    textArr.width = this.config.width;
    textArr.height = this.config.height;

    // Generate random positions
    for (const item of textArr.text) {
      const [x, y] = this.randPosition(
        textArr.text,
        textArr.width,
        textArr.height,
        item.width,
        item.height,
        item.icon
      );
      item.x = x;
      item.y = y;
      text.push(item.text);
    }

    // Slice to get only the required points
    textArr.text = textArr.text.slice(0, this.config.length);
    text.splice(0, this.config.length);

    // Save to database
    const nowTime = new Date();
    await this.prisma.baCaptcha.upsert({
      where: { key: md5(id) },
      update: {
        code: md5(text.join(',')),
        captcha: JSON.stringify(textArr),
        create_time: nowTime,
        expire_time: new Date(nowTime.getTime() + this.expire * 1000),
      },
      create: {
        key: md5(id.toString()),
        code: md5(text.join(',')),
        captcha: JSON.stringify(textArr),
        create_time: nowTime,
        expire_time: new Date(nowTime.getTime() + this.expire * 1000),
      }
    });

    return {
      id,
      text,
      base64: svgToBase64(captcha.data), // SVG data
      width: textArr.width,
      height: textArr.height,
    };
  }

  async check(id: string, info: string, unset = true): Promise<boolean> {
    const key = md5(id);
    const captcha = await this.prisma.baCaptcha.findUnique({ where: { key } });

    if (!captcha) {
      return false;
    }

    // Check expiration
    if (Date.now() > captcha.expire_time.getTime()) {
      if (unset) {
        await this.prisma.baCaptcha.delete({ where: { key } });
      }
      return false;
    }

    const textArr = JSON.parse(captcha.captcha);
    const [xy, w, h] = info.split(';');
    const xyArr = xy.split('-');
    const xPro = Number(w) / textArr.width; // Width ratio
    const yPro = Number(h) / textArr.height; // Height ratio

    for (let i = 0; i < xyArr.length; i++) {
      const [x, y] = xyArr[i].split(',').map(Number);
      const item = textArr.text[i];

      if (
        x / xPro < item.x ||
        x / xPro > item.x + item.width
      ) {
        return false;
      }

      const phStart = item.icon ? item.y : item.y - item.height;
      const phEnd = item.icon ? item.y + item.height : item.y;

      if (
        y / yPro < phStart ||
        y / yPro > phEnd
      ) {
        return false;
      }
    }

    if (unset) {
      await this.prisma.baCaptcha.delete({ where: { key } });
    }
    return true;
  }

  private randPoints(length = 4): string[] {
    const arr: string[] = [];

    // Text
    if (this.config.mode.includes('text')) {
      for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * this.config.zhSet.length);
        arr.push(this.config.zhSet.charAt(index));
      }
    }

    // Icon
    if (this.config.mode.includes('icon')) {
      const icons = Object.keys(this.iconDict);
      const shuffled = [...icons].sort(() => 0.5 - Math.random());
      arr.push(...shuffled.slice(0, length));
    }

    // Shuffle and return
    return arr.sort(() => 0.5 - Math.random()).slice(0, length);
  }

  private randPosition(
    textArr: any[],
    imgW: number,
    imgH: number,
    fontW: number,
    fontH: number,
    isIcon: boolean
  ): [number, number] {
    const x = Math.floor(Math.random() * (imgW - fontW));
    const y = Math.floor(Math.random() * (imgH - fontH)) + fontH;

    if (!this.checkPosition(textArr, x, y, fontW, fontH, isIcon)) {
      return this.randPosition(textArr, imgW, imgH, fontW, fontH, isIcon);
    }

    return [x, y];
  }

  private checkPosition(
    textArr: any[],
    x: number,
    y: number,
    w: number,
    h: number,
    isIcon: boolean
  ): boolean {
    for (const item of textArr) {
      if (item.x !== undefined && item.y !== undefined) {
        const flagX = x + w < item.x || x > item.x + item.width;
        const currentPhStart = isIcon ? y : y - h;
        const currentPhEnd = isIcon ? y + h : y;
        const historyPhStart = item.icon ? item.y : item.y - item.height;
        const historyPhEnd = item.icon ? item.y + item.height : item.y;
        const flagY = currentPhEnd < historyPhStart || currentPhStart > historyPhEnd;

        if (!flagX && !flagY) {
          return false;
        }
      }
    }
    return true;
  }
}