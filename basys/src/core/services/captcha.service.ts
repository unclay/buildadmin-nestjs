const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database';

@Injectable()
export class CaptchaService {
  private config: {
    // 验证码加密密钥
    seKey: string;
    // 验证码字符集合
    codeSet: string;
    // 验证码过期时间（s）
    expire: number;
    // 使用中文验证码
    useZh: boolean;
    // 中文验证码字符串
    zhSet: string;
    // 使用背景图片
    useImgBg: boolean;
    // 验证码字体大小(px)
    fontSize: number;
    // 是否画混淆曲线
    useCurve: boolean;
    // 是否添加杂点
    useNoise: boolean;
    // 验证码图片高度
    imageH: number;
    // 验证码图片宽度
    imageW: number;
    // 验证码位数
    length: number;
    // 验证码字体，不设置随机获取
    fontTtf: string;
    // 背景颜色
    bg: number[];
    // 验证成功后是否重置
    reset: boolean;
  };
  canvas: any;
  ctx: any;
  color: any;
  constructor(private readonly prisma: PrismaService) {
    this.config = {
      // 验证码加密密钥
      seKey: 'BuildAdmin',
      // 验证码字符集合
      codeSet: '2345678abcdefhijkmnpqrstuvwxyzABCDEFGHJKLMNPQRTUVWXY',
      // 验证码过期时间（s）
      expire: 600,
      // 使用中文验证码
      useZh: false,
      // 中文验证码字符串
      zhSet: '们以我到他会作时要动国产的一是工就年阶义发成部民可出能方进在了不和有大这主中人上为来分生对于学下级地个用同行面说种过命度革而多子后自社加小机也经力线本电高量长党得实家定深法表着水理化争现所二起政三好十战无农使性前等反体合斗路图把结第里正新开论之物从当两些还天资事队批点育重其思与间内去因件日利相由压员气业代全组数果期导平各基或月毛然如应形想制心样干都向变关问比展那它最及外没看治提五解系林者米群头意只明四道马认次文通但条较克又公孔领军流入接席位情运器并飞原油放立题质指建区验活众很教决特此常石强极土少已根共直团统式转别造切九你取西持总料连任志观调七么山程百报更见必真保热委手改管处己将修支识病象几先老光专什六型具示复安带每东增则完风回南广劳轮科北打积车计给节做务被整联步类集号列温装即毫知轴研单色坚据速防史拉世设达尔场织历花受求传口断况采精金界品判参层止边清至万确究书术状厂须离再目海交权且儿青才证低越际八试规斯近注办布门铁需走议县兵固除般引齿千胜细影济白格效置推空配刀叶率述今选养德话查差半敌始片施响收华觉备名红续均药标记难存测士身紧液派准斤角降维板许破述技消底床田势端感往神便贺村构照容非搞亚磨族火段算适讲按值美态黄易彪服早班麦削信排台声该击素张密害侯草何树肥继右属市严径螺检左页抗苏显苦英快称坏移约巴材省黑武培著河帝仅针怎植京助升王眼她抓含苗副杂普谈围食射源例致酸旧却充足短划剂宣环落首尺波承粉践府鱼随考刻靠够满夫失包住促枝局菌杆周护岩师举曲春元超负砂封换太模贫减阳扬江析亩木言球朝医校古呢稻宋听唯输滑站另卫字鼓刚写刘微略范供阿块某功套友限项余倒卷创律雨让骨远帮初皮播优占死毒圈伟季训控激找叫云互跟裂粮粒母练塞钢顶策双留误础吸阻故寸盾晚丝女散焊功株亲院冷彻弹错散商视艺灭版烈零室轻血倍缺厘泵察绝富城冲喷壤简否柱李望盘磁雄似困巩益洲脱投送奴侧润盖挥距触星松送获兴独官混纪依未突架宽冬章湿偏纹吃执阀矿寨责熟稳夺硬价努翻奇甲预职评读背协损棉侵灰虽矛厚罗泥辟告卵箱掌氧恩爱停曾溶营终纲孟钱待尽俄缩沙退陈讨奋械载胞幼哪剥迫旋征槽倒握担仍呀鲜吧卡粗介钻逐弱脚怕盐末阴丰雾冠丙街莱贝辐肠付吉渗瑞惊顿挤秒悬姆烂森糖圣凹陶词迟蚕亿矩康遵牧遭幅园腔订香肉弟屋敏恢忘编印蜂急拿扩伤飞露核缘游振操央伍域甚迅辉异序免纸夜乡久隶缸夹念兰映沟乙吗儒杀汽磷艰晶插埃燃欢铁补咱芽永瓦倾阵碳演威附牙芽永瓦斜灌欧献顺猪洋腐请透司危括脉宜笑若尾束壮暴企菜穗楚汉愈绿拖牛份染既秋遍锻玉夏疗尖殖井费州访吹荣铜沿替滚客召旱悟刺脑措贯藏敢令隙炉壳硫煤迎铸粘探临薄旬善福纵择礼愿伏残雷延烟句纯渐耕跑泽慢栽鲁赤繁境潮横掉锥希池败船假亮谓托伙哲怀割摆贡呈劲财仪沉炼麻罪祖息车穿货销齐鼠抽画饲龙库守筑房歌寒喜哥洗蚀废纳腹乎录镜妇恶脂庄擦险赞钟摇典柄辩竹谷卖乱虚桥奥伯赶垂途额壁网截野遗静谋弄挂课镇妄盛耐援扎虑键归符庆聚绕摩忙舞遇索顾胶羊湖钉仁音迹碎伸灯避泛亡答勇频皇柳哈揭甘诺概宪浓岛袭谁洪谢炮浇斑讯懂灵蛋闭孩释乳巨徒私银伊景坦累匀霉杜乐勒隔弯绩招绍胡呼痛峰零柴簧午跳居尚丁秦稍追梁折耗碱殊岗挖氏刃剧堆赫荷胸衡勤膜篇登驻案刊秧缓凸役剪川雪链渔啦脸户洛孢勃盟买杨宗焦赛旗滤硅炭股坐蒸凝竟陷枪黎救冒暗洞犯筒您宋弧爆谬涂味津臂障褐陆啊健尊豆拔莫抵桑坡缝警挑污冰柬嘴啥饭塑寄赵喊垫丹渡耳刨虎笔稀昆浪萨茶滴浅拥穴覆伦娘吨浸袖珠雌妈紫戏塔锤震岁貌洁剖牢锋疑霸闪埔猛诉刷狠忽灾闹乔唐漏闻沈熔氯荒茎男凡抢像浆旁玻亦忠唱蒙予纷捕锁尤乘乌智淡允叛畜俘摸锈扫毕璃宝芯爷鉴秘净蒋钙肩腾枯抛轨堂拌爸循诱祝励肯酒绳穷塘燥泡袋朗喂铝软渠颗惯贸粪综墙趋彼届墨碍启逆卸航衣孙龄岭骗休借',
      // 使用背景图片
      useImgBg: false,
      // 验证码字体大小(px)
      fontSize: 25,
      // 是否画混淆曲线
      useCurve: true,
      // 是否添加杂点
      useNoise: true,
      // 验证码图片高度
      imageH: 0,
      // 验证码图片宽度
      imageW: 0,
      // 验证码位数
      length: 4,
      // 验证码字体，不设置随机获取
      fontTtf: '',
      // 背景颜色
      bg: [243, 251, 254],
      // 验证成功后是否重置
      reset: true,
    };
  }

  // 使用 this.name 获取配置
  get(name) {
    return this.config[name];
  }

  // 设置验证码配置
  set(name, value) {
    if (this.config.hasOwnProperty(name)) {
      this.config[name] = value;
    }
  }

  // 验证验证码是否正确
  async check(code, id) {
    const key = this.authCode(this.config.seKey, id);
    const seCode = await this.getCaptchaData(id);

    // 验证码为空
    if (!code || !seCode) {
      return false;
    }

    // 验证码过期
    if (Number(Date.now()) > Number(seCode.expire_time)) {
      await this.deleteCaptcha(key);
      return false;
    }

    if (this.authCode(code.toUpperCase(), id) === seCode.code) {
      if (this.config.reset) {
        await this.deleteCaptcha(key);
      }
      return true;
    }

    return false;
  }

  // 创建一个逻辑验证码可供后续验证（非图形）
  async create(id: number, isCaptcha = false) {
    const nowTime = Date.now();
    const key = this.authCode(this.config.seKey, id);
    
    // 删除已存在的验证码
    await this.deleteCaptcha(key);
    
    const captcha = this.generate(isCaptcha);
    const code = this.authCode(captcha, id);
    
    await this.saveCaptcha({
      key,
      code,
      captcha,
      create_time: nowTime,
      expire_time: nowTime + this.config.expire * 1000
    });
    
    return captcha;
  }

  // 获取验证码数据
  async getCaptchaData(id) {
    const key = this.authCode(this.config.seKey, id);
    const seCode = await this.prisma.baCaptcha.findUnique({
      where: {
        key,
      },
    });
    if (!seCode) {
      throw new Error('Captcha not found');
    }
    return seCode;
  }

  // 保存验证码到数据库
  async saveCaptcha(data) {
    // 实际应用中应该保存到数据库
    await this.prisma.baCaptcha.create({
      data,
    });
  }

  // 从数据库删除验证码
  async deleteCaptcha(key) {
    // 实际应用中应该从数据库删除
    await this.prisma.baCaptcha.delete({
      where: {
        key,
      },
    });
  }

  // 生成图形验证码
  async entry(id) {
    const nowTime = Date.now();
    
    // 图片宽(px)
    this.config.imageW = this.config.imageW || 
      this.config.length * this.config.fontSize * 1.5 + 
      this.config.length * this.config.fontSize / 2;
    
    // 图片高(px)
    this.config.imageH = this.config.imageH || this.config.fontSize * 2.5;
    
    // 创建画布
    this.canvas = createCanvas(this.config.imageW, this.config.imageH);
    this.ctx = this.canvas.getContext('2d');
    
    // 设置背景
    this.ctx.fillStyle = `rgb(${this.config.bg.join(',')})`;
    this.ctx.fillRect(0, 0, this.config.imageW, this.config.imageH);
    
    // 验证码字体随机颜色
    this.color = `rgb(${this.getRandomInt(1, 150)}, ${this.getRandomInt(1, 150)}, ${this.getRandomInt(1, 150)})`;
    
    // 验证码使用随机字体
    const ttfPath = path.join(__dirname, 'public', 'static', 'fonts', 
      this.config.useZh ? 'zhttfs' : 'ttfs');
    
    if (!this.config.fontTtf) {
      const ttfFiles = fs.readdirSync(ttfPath)
        .filter(file => file.endsWith('.ttf'));
      this.config.fontTtf = path.join(ttfPath, ttfFiles[Math.floor(Math.random() * ttfFiles.length)]);
    }
    
    if (this.config.useImgBg) {
      await this.background();
    }
    
    if (this.config.useNoise) {
      this.writeNoise();
    }
    
    if (this.config.useCurve) {
      this.writeCurve();
    }
    
    const key = this.authCode(this.config.seKey, id);
    const captchaData = await this.getCaptchaData(id);
    
    // 绘制验证码
    let captcha;
    if (captchaData && nowTime <= Number(captchaData.expire_time)) {
      captcha = this.writeText(captchaData.captcha);
    } else {
      captcha = this.writeText();
      
      // 保存验证码
      const code = this.authCode(captcha.toUpperCase(), id);
      await this.saveCaptcha({
        key,
        code,
        captcha,
        create_time: nowTime,
        expire_time: nowTime + this.config.expire * 1000
      });
    }
    
    // 返回图片Buffer
    return this.canvas.toBuffer('image/png');
  }

  // 绘制验证码文本
  writeText(captcha = '') {
    let code = '';
    
    if (this.config.useZh) {
      // 中文验证码
      for (let i = 0; i < this.config.length; i++) {
        const char = captcha ? captcha[i] : 
          this.config.zhSet.charAt(Math.floor(Math.random() * this.config.zhSet.length));
        code += char;
        
        this.ctx.fillStyle = this.color;
        this.ctx.font = `${this.config.fontSize}px "${this.config.fontTtf}"`;
        this.ctx.rotate(this.getRandomInt(-40, 40) * Math.PI / 180);
        this.ctx.fillText(
          char,
          this.config.fontSize * (i + 1) * 1.5,
          this.config.fontSize + this.getRandomInt(10, 20)
        );
        this.ctx.rotate(-this.getRandomInt(-40, 40) * Math.PI / 180);
      }
    } else {
      let codeNX = 0;
      for (let i = 0; i < this.config.length; i++) {
        const char = captcha ? captcha[i] : 
          this.config.codeSet.charAt(Math.floor(Math.random() * this.config.codeSet.length));
        code += char;
        codeNX += this.getRandomInt(this.config.fontSize * 1.2, this.config.fontSize * 1.6);
        
        this.ctx.fillStyle = this.color;
        this.ctx.font = `${this.config.fontSize}px "${this.config.fontTtf}"`;
        this.ctx.rotate(this.getRandomInt(-40, 40) * Math.PI / 180);
        this.ctx.fillText(
          char,
          codeNX,
          this.config.fontSize * 1.6
        );
        this.ctx.rotate(-this.getRandomInt(-40, 40) * Math.PI / 180);
      }
    }
    
    return captcha || code;
  }

  // 绘制干扰曲线
  writeCurve() {
    let py = 0;
    
    // 曲线前部分
    const A = this.getRandomInt(1, this.config.imageH / 2); // 振幅
    const b = this.getRandomInt(-this.config.imageH / 4, this.config.imageH / 4); // Y轴方向偏移量
    const f = this.getRandomInt(-this.config.imageH / 4, this.config.imageH / 4); // X轴方向偏移量
    const T = this.getRandomInt(this.config.imageH, this.config.imageW * 2); // 周期
    const w = (2 * Math.PI) / T;
    
    let px1 = 0; // 曲线横坐标起始位置
    let px2 = this.getRandomInt(this.config.imageW / 2, this.config.imageW * 0.8); // 曲线横坐标结束位置
    
    for (let px = px1; px <= px2; px += 1) {
      if (w !== 0) {
        py = A * Math.sin(w * px + f) + b + this.config.imageH / 2;
        let i = Math.floor(this.config.fontSize / 5);
        while (i > 0) {
          this.drawPixel(px + i, py + i);
          i--;
        }
      }
    }
    
    // 曲线后部分
    const A2 = this.getRandomInt(1, this.config.imageH / 2);
    const f2 = this.getRandomInt(-this.config.imageH / 4, this.config.imageH / 4);
    const T2 = this.getRandomInt(this.config.imageH, this.config.imageW * 2);
    const w2 = (2 * Math.PI) / T2;
    const b2 = py - A2 * Math.sin(w2 * px2 + f2) - this.config.imageH / 2;
    px1 = px2;
    px2 = this.config.imageW;
    
    for (let px = px1; px <= px2; px += 1) {
      if (w2 !== 0) {
        py = A2 * Math.sin(w2 * px + f2) + b2 + this.config.imageH / 2;
        let i = Math.floor(this.config.fontSize / 5);
        while (i > 0) {
          this.drawPixel(px + i, py + i);
          i--;
        }
      }
    }
  }

  // 绘制干扰点
  writeNoise() {
    const codeSet = '2345678abcdefhijkmnpqrstuvwxyz';
    for (let i = 0; i < 10; i++) {
      // 干扰点颜色
      const noiseColor = `rgb(${this.getRandomInt(150, 225)}, ${this.getRandomInt(150, 225)}, ${this.getRandomInt(150, 225)})`;
      for (let j = 0; j < 5; j++) {
        this.ctx.fillStyle = noiseColor;
        this.ctx.font = '5px Arial';
        this.ctx.fillText(
          codeSet.charAt(Math.floor(Math.random() * 29)),
          this.getRandomInt(-10, this.config.imageW),
          this.getRandomInt(-10, this.config.imageH)
        );
      }
    }
  }

  // 绘制背景图片
  async background() {
    const bgPath = path.join(__dirname, 'public', 'static', 'images', 'captcha', 'image');
    const bgFiles = fs.readdirSync(bgPath)
      .filter(file => file.endsWith('.jpg'));
    
    if (bgFiles.length === 0) return;
    
    const bgFile = path.join(bgPath, bgFiles[Math.floor(Math.random() * bgFiles.length)]);
    
    // 这里简化处理，实际应该使用canvas加载图片
    // 实际实现需要使用类似node-canvas的loadImage方法
    console.log('Background image:', bgFile);
  }

  // 加密验证码
  authCode(str, id) {
    const key = crypto.createHash('md5').update(this.config.seKey).digest('hex').substring(5, 13);
    const strHash = crypto.createHash('md5').update(str).digest('hex').substring(8, 18);
    return crypto.createHash('md5').update(key + strHash + id).digest('hex');
  }

  // 生成验证码随机字符
  generate(captcha = false) {
    let code = '';
    if (this.config.useZh) {
      // 中文验证码
      for (let i = 0; i < this.config.length; i++) {
        code += captcha ? captcha[i] : 
          this.config.zhSet.charAt(Math.floor(Math.random() * this.config.zhSet.length));
      }
    } else {
      for (let i = 0; i < this.config.length; i++) {
        code += captcha ? captcha[i] : 
          this.config.codeSet.charAt(Math.floor(Math.random() * this.config.codeSet.length));
      }
    }
    return typeof captcha === 'string' ? (captcha as string).toUpperCase() : code.toUpperCase();
  }

  // 绘制像素点
  drawPixel(x, y) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y, 1, 1);
  }

  // 获取随机整数
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
