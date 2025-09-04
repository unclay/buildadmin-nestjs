/**
 * 树
 */
export class BaTree {
  /**
   * 实例
   */
  private static instance: BaTree | null = null;

  /**
   * 生成树型结构所需修饰符号
   */
  public static icon: string[] = ['│', '├', '└'];

  /**
   * 子级数据（树枝）
   */
  protected children: any[] = [];

  /**
   * 初始化
   */
  public static getInstance(): BaTree {
    if (!BaTree.instance) {
      BaTree.instance = new BaTree();
    }
    return BaTree.instance;
  }

  /**
   * 将数组某个字段渲染为树状,需自备children children可通过this.assembleChild()方法组装
   * @param arr 要改为树状的数组
   * @param field '树枝'字段
   * @param level 递归数组层次,无需手动维护
   * @param superiorEnd 递归上一级树枝是否结束,无需手动维护
   */
  public static getTreeArray(arr: any[], field: string = 'name', level: number = 0, superiorEnd: boolean = false): any[] {
    level++;
    let num = 1;
    const total = arr.length;
    arr.forEach((item, index) => {
      const prefix = (num === total) ? BaTree.icon[2] : BaTree.icon[1];
      if (level === 2) {
        arr[index][field] = ' '.repeat(4) + prefix + item[field];
      } else if (level >= 3) {
        arr[index][field] = ' '.repeat(4) + (superiorEnd ? '' : BaTree.icon[0]) + ' '.repeat((level - 2) * 4) + prefix + item[field];
      }

      if (item.children) {
        arr[index].children = BaTree.getTreeArray(item.children, field, level, num === total);
      }
      num++;
    });
    return arr;
  }

  /**
   * 递归合并树状数组（根据children多维变二维方便渲染）
   * @param data 要合并的数组
   */
  public static assembleTree(data: any[]): any[] {
    const arr: any[] = [];
    data.forEach(v => {
      const { children = [], ...rest } = v;
      arr.push(rest);
      if (children.length) {
        arr.push(...BaTree.assembleTree(children));
      }
    });
    return arr;
  }

  /**
   * 递归的根据指定字段组装 children 数组
   * @param data 数据源
   * @param pid 存储上级id的字段
   * @param pk 主键字段
   */
  public assembleChild(data: any[], pid: string = 'pid', pk: string = 'id'): any[] {
    if (!data.length) return [];
    const pks: any[] = [];
    const topLevelData: any[] = [];
    this.children = [];

    data.forEach(item => {
      pks.push(item[pk]);
      if (!this.children[item[pid]]) {
        this.children[item[pid]] = [];
      }
      this.children[item[pid]].push(item);
    });

    data.forEach(item => {
      if (!pks.includes(item[pid])) {
        topLevelData.push(item);
      }
    });

    if (Object.keys(this.children).length > 0) {
      topLevelData.forEach((item, key) => {
        topLevelData[key].children = this.getChildren(this.children[item[pk]] || [], pk);
      });
      return topLevelData;
    }
    return data;
  }

  /**
   * 获取 children 数组
   * 辅助 assembleChild 组装 children
   */
  protected getChildren(data: any[], pk: string = 'id'): any[] {
    if (!data.length) return [];

    data.forEach((item, key) => {
      if (this.children[item[pk]]) {
        data[key].children = this.getChildren(this.children[item[pk]], pk);
      }
    });
    return data;
  }
}