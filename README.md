# H5代付交易系统

基于Vue 3开发的代付交易H5应用，支持Gcash和Maya支付渠道。

## 功能特性

- 代付交易功能（支持Gcash和Maya）
- 交易记录查询
- 交易状态查询
- 响应式设计，适配移动设备

## 技术栈

- Vue 3
- Vue Router 4
- Vant UI组件库
- Axios
- Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run serve
```

## 项目结构

```
├── public/           # 静态资源
├── src/              # 源代码
│   ├── api/          # API接口
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── utils/        # 工具函数
│   ├── views/        # 页面
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── index.html        # HTML模板
├── vite.config.js    # Vite配置
└── package.json      # 依赖和脚本
```

## API配置

API接口配置位于 `src/api/index.js`，包含以下支付渠道：

- **Gcash**: 
  - 商户号: skc01
  - 秘钥: 0097b781a439442e1b6424e3d740efb1

- **Maya**: 
  - 商户号: skc01-paymaya
  - 秘钥: 211a637b1359abf94d5a366804f204ae

API基础URL: `https://72pay.la2568.site/` 