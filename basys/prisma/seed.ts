import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.baAdmin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      nickname: 'Admin',
      avatar: '',
      email: 'admin@buildadmin.com',
      mobile: '18888888888',
      login_failure: 0,
      last_login_time: new Date(1754215106000), // Unix 秒转毫秒
      last_login_ip: '127.0.0.1',
      password: '$2b$12$3Rh6f1URfIz8qiIPBqzuGuXsPFj4NnGQ2/eyLiuI07SiPMACf6qme', // 替换实际密码
      salt: '',
      motto: '',
      status: 'enable',
      create_time: new Date(1754215106000),
    },
  });
  await prisma.baAdminGroup.createMany({
    data: [
      {
        pid: 0,
        name: '超级管理组',
        rules: '*',
        status: 1,
        update_time: new Date(1754215106000),
        create_time: new Date(1754215106000),
      },
      {
        pid: 1,
        name: '一级管理员',
        rules: '1,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,77,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,89',
        status: 1,
        update_time: new Date(1754215106000),
        create_time: new Date(1754215106000),
      },
      {
        pid: 2,
        name: '二级管理员',
        rules: '21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43',
        status: 1,
        update_time: new Date(1754215106000),
        create_time: new Date(1754215106000),
      },
      {
        pid: 3,
        name: '三级管理员',
        rules: '55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75',
        status: 1,
        update_time: new Date(1754215106000),
        create_time: new Date(1754215106000),
      },
    ],
  });
  await prisma.baAdminGroupAccess.create({
    data: {
      uid: 1,
      group_id: 1,
    },
  });
  await prisma.baAdminRule.createMany({
    data: [
      { pid: 0, type: "menu", title: "控制台", name: "dashboard", path: "dashboard", icon: "fa fa-dashboard", menu_type: "tab", url: "", component: "/src/views/backend/dashboard.vue", keepalive: 1, extend: "none", remark: "Remark lang", weigh: 999, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu_dir", title: "权限管理", name: "auth", path: "auth", icon: "fa fa-group", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 100, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 2, type: "menu", title: "角色组管理", name: "auth/group", path: "auth/group", icon: "fa fa-group", menu_type: "tab", url: "", component: "/src/views/backend/auth/group/index.vue", keepalive: 1, extend: "none", remark: "Remark lang", weigh: 99, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 3, type: "button", title: "查看", name: "auth/group/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 3, type: "button", title: "添加", name: "auth/group/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 3, type: "button", title: "编辑", name: "auth/group/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 3, type: "button", title: "删除", name: "auth/group/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 2, type: "menu", title: "管理员管理", name: "auth/admin", path: "auth/admin", icon: "el-icon-UserFilled", menu_type: "tab", url: "", component: "/src/views/backend/auth/admin/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 98, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 8, type: "button", title: "查看", name: "auth/admin/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 8, type: "button", title: "添加", name: "auth/admin/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 8, type: "button", title: "编辑", name: "auth/admin/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 8, type: "button", title: "删除", name: "auth/admin/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 2, type: "menu", title: "菜单规则管理", name: "auth/rule", path: "auth/rule", icon: "el-icon-Grid", menu_type: "tab", url: "", component: "/src/views/backend/auth/rule/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 97, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 13, type: "button", title: "查看", name: "auth/rule/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 13, type: "button", title: "添加", name: "auth/rule/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 13, type: "button", title: "编辑", name: "auth/rule/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 13, type: "button", title: "删除", name: "auth/rule/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 13, type: "button", title: "快速排序", name: "auth/rule/sortable", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 2, type: "menu", title: "管理员日志管理", name: "auth/adminLog", path: "auth/adminLog", icon: "el-icon-List", menu_type: "tab", url: "", component: "/src/views/backend/auth/adminLog/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 96, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 19, type: "button", title: "查看", name: "auth/adminLog/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu_dir", title: "会员管理", name: "user", path: "user", icon: "fa fa-drivers-license", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 95, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 21, type: "menu", title: "会员管理", name: "user/user", path: "user/user", icon: "fa fa-user", menu_type: "tab", url: "", component: "/src/views/backend/user/user/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 94, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 22, type: "button", title: "查看", name: "user/user/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 22, type: "button", title: "添加", name: "user/user/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 22, type: "button", title: "编辑", name: "user/user/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 22, type: "button", title: "删除", name: "user/user/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 21, type: "menu", title: "会员分组管理", name: "user/group", path: "user/group", icon: "fa fa-group", menu_type: "tab", url: "", component: "/src/views/backend/user/group/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 93, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 27, type: "button", title: "查看", name: "user/group/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 27, type: "button", title: "添加", name: "user/group/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 27, type: "button", title: "编辑", name: "user/group/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 27, type: "button", title: "删除", name: "user/group/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 21, type: "menu", title: "会员规则管理", name: "user/rule", path: "user/rule", icon: "fa fa-th-list", menu_type: "tab", url: "", component: "/src/views/backend/user/rule/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 92, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 32, type: "button", title: "查看", name: "user/rule/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 32, type: "button", title: "添加", name: "user/rule/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 32, type: "button", title: "编辑", name: "user/rule/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 32, type: "button", title: "删除", name: "user/rule/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 32, type: "button", title: "快速排序", name: "user/rule/sortable", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 21, type: "menu", title: "会员余额管理", name: "user/moneyLog", path: "user/moneyLog", icon: "el-icon-Money", menu_type: "tab", url: "", component: "/src/views/backend/user/moneyLog/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 91, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 38, type: "button", title: "查看", name: "user/moneyLog/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 38, type: "button", title: "添加", name: "user/moneyLog/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 21, type: "menu", title: "会员积分管理", name: "user/scoreLog", path: "user/scoreLog", icon: "el-icon-Discount", menu_type: "tab", url: "", component: "/src/views/backend/user/scoreLog/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 90, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 41, type: "button", title: "查看", name: "user/scoreLog/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 41, type: "button", title: "添加", name: "user/scoreLog/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu_dir", title: "常规管理", name: "routine", path: "routine", icon: "fa fa-cogs", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 89, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 44, type: "menu", title: "系统配置", name: "routine/config", path: "routine/config", icon: "el-icon-Tools", menu_type: "tab", url: "", component: "/src/views/backend/routine/config/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 88, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 45, type: "button", title: "查看", name: "routine/config/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 45, type: "button", title: "编辑", name: "routine/config/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 44, type: "menu", title: "附件管理", name: "routine/attachment", path: "routine/attachment", icon: "fa fa-folder", menu_type: "tab", url: "", component: "/src/views/backend/routine/attachment/index.vue", keepalive: 1, extend: "none", remark: "Remark lang", weigh: 87, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 48, type: "button", title: "查看", name: "routine/attachment/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 48, type: "button", title: "编辑", name: "routine/attachment/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 48, type: "button", title: "删除", name: "routine/attachment/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 44, type: "menu", title: "个人资料", name: "routine/adminInfo", path: "routine/adminInfo", icon: "fa fa-user", menu_type: "tab", url: "", component: "/src/views/backend/routine/adminInfo.vue", keepalive: 1, extend: "none", remark: "", weigh: 86, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 52, type: "button", title: "查看", name: "routine/adminInfo/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 52, type: "button", title: "编辑", name: "routine/adminInfo/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu_dir", title: "数据安全管理", name: "security", path: "security", icon: "fa fa-shield", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 85, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 55, type: "menu", title: "数据回收站", name: "security/dataRecycleLog", path: "security/dataRecycleLog", icon: "fa fa-database", menu_type: "tab", url: "", component: "/src/views/backend/security/dataRecycleLog/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 84, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 56, type: "button", title: "查看", name: "security/dataRecycleLog/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 56, type: "button", title: "删除", name: "security/dataRecycleLog/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 56, type: "button", title: "还原", name: "security/dataRecycleLog/restore", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 56, type: "button", title: "查看详情", name: "security/dataRecycleLog/info", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 55, type: "menu", title: "敏感数据修改记录", name: "security/sensitiveDataLog", path: "security/sensitiveDataLog", icon: "fa fa-expeditedssl", menu_type: "tab", url: "", component: "/src/views/backend/security/sensitiveDataLog/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 83, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 61, type: "button", title: "查看", name: "security/sensitiveDataLog/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 61, type: "button", title: "删除", name: "security/sensitiveDataLog/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 61, type: "button", title: "回滚", name: "security/sensitiveDataLog/rollback", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 61, type: "button", title: "查看详情", name: "security/sensitiveDataLog/info", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 55, type: "menu", title: "数据回收规则管理", name: "security/dataRecycle", path: "security/dataRecycle", icon: "fa fa-database", menu_type: "tab", url: "", component: "/src/views/backend/security/dataRecycle/index.vue", keepalive: 1, extend: "none", remark: "Remark lang", weigh: 82, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 66, type: "button", title: "查看", name: "security/dataRecycle/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 66, type: "button", title: "添加", name: "security/dataRecycle/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 66, type: "button", title: "编辑", name: "security/dataRecycle/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 66, type: "button", title: "删除", name: "security/dataRecycle/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 55, type: "menu", title: "敏感字段规则管理", name: "security/sensitiveData", path: "security/sensitiveData", icon: "fa fa-expeditedssl", menu_type: "tab", url: "", component: "/src/views/backend/security/sensitiveData/index.vue", keepalive: 1, extend: "none", remark: "Remark lang", weigh: 81, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 71, type: "button", title: "查看", name: "security/sensitiveData/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 71, type: "button", title: "添加", name: "security/sensitiveData/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 71, type: "button", title: "编辑", name: "security/sensitiveData/edit", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 71, type: "button", title: "删除", name: "security/sensitiveData/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu", title: "BuildAdmin", name: "buildadmin", path: "buildadmin", icon: "local-logo", menu_type: "link", url: "https://doc.buildadmin.com", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 0, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 45, type: "button", title: "添加", name: "routine/config/add", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu", title: "模块市场", name: "moduleStore/moduleStore", path: "moduleStore", icon: "el-icon-GoodsFilled", menu_type: "tab", url: "", component: "/src/views/backend/module/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 86, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 78, type: "button", title: "查看", name: "moduleStore/moduleStore/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 78, type: "button", title: "安装", name: "moduleStore/moduleStore/install", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 78, type: "button", title: "调整状态", name: "moduleStore/moduleStore/changeState", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 78, type: "button", title: "卸载", name: "moduleStore/moduleStore/uninstall", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 78, type: "button", title: "更新", name: "moduleStore/moduleStore/update", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 0, type: "menu", title: "CRUD代码生成", name: "crud/crud", path: "crud/crud", icon: "fa fa-code", menu_type: "tab", url: "", component: "/src/views/backend/crud/index.vue", keepalive: 1, extend: "none", remark: "", weigh: 80, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 84, type: "button", title: "查看", name: "crud/crud/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 84, type: "button", title: "生成", name: "crud/crud/generate", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 84, type: "button", title: "删除", name: "crud/crud/delete", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 45, type: "button", title: "删除", name: "routine/config/del", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) },
      { pid: 1, type: "button", title: "查看", name: "dashboard/index", path: "", icon: "", menu_type: null, url: "", component: "", keepalive: 0, extend: "none", remark: "", weigh: 0, status: 1, update_time: new Date(1754215106000), create_time: new Date(1754215106000) }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });