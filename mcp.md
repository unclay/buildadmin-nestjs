- 代码规范
  - 导入规范
    - 使用相对路径：所有 import 必须使用相对路径: 例如 './core', 禁止使用 'src/core'
    - 合并导入：如果多个导入来自同一个模块（即相同的基础路径），应该合并成一个import语句，从该模块的统一导出点导入。
    - 模块导出假设​​：假设每个模块（如"../../core"）都有一个索引文件（如index.ts），集中导出所有相关内容。因此，你应该从模块的根路径导入，而不是子路径。
    - 案例：
      - 错误：
        ```
        import { PrismaService } from 'src/core';
        import { RequestDto } from '../../core/dtos/request.dto';
        ```
      - 正确：
        ```
        import { PrismaService, RequestDto } from '../../core';
        ```
