# Fishing Map Tool

本项目是一个纯前端、可直接本地运行或部署到 GitHub Pages 的海图区域演示工具。

## 运行方式

直接打开 `index.html` 即可。

## 当前能力

- 上传本地海图作为背景
- 绘制 `Polygon / Rectangle / Circle` 区域
- 自由涂抹生成不规则区域
- 线稿图层绘制与图层列表展示
- JSON 导入 / 导出
- localStorage 本地存储
- 区域列表、区域详情、区域编辑

## 新增：规则仲裁展示 Demo

本次新增的重点不是完整生产级编辑器，而是让系统逻辑更容易向老板或同事解释。

### 新增能力

- 新增五类规则标签字段：
  - `EnvironmentTag`
  - `AccessTag`
  - `FishingInteractionTag`
  - `NavigationInteractionTag`
  - `FishSpawnTag`
- 新增内置 `RuleDomain -> TagCategory` 绑定展示
- 新增内置 Tag Priority 配置展示
- 新增点击地图任意点分析
- 新增 `Region View / Rule View / Aura View` 三种视图模式
- 新增 `Rule Resolution` 面板，展示：
  - 命中的 Region
  - 各 RuleDomain 的候选 Tag
  - 优先级比较结果
  - 胜出 Region / Tag
  - 最终生效的 Profile
  - Aura Summary
- 新增 `Aura View` 面板，展示最终环境 / 钓鱼 / 航行 / 鱼群效果摘要
- 区域详情补充：
  - 五类规则标签
  - 各 RuleDomain 对应 Profile
  - Aura 摘要

### 演示数据

项目内置了一份可直接导入的演示数据：

- `offshore-region-config.sample.json`

这份样例包含：

- `1` 个 `BaseSeaArea`
- `1` 个 `EventArea`
- `2` 个 `PoiInfluenceArea`
- 多个重叠区域
- 至少一个点击点位时可触发多 RuleDomain 仲裁的案例

### 设计说明

- 不同 `RuleDomain` 会读取不同的 Tag 字段进行仲裁
- Tag 使用内置优先级表进行排序
- 若优先级相同，则继续参考 Region 自身 `Priority`
- 最终仅输出展示型 `ProfileId` 和 `AuraSummary`
- 当前不包含完整的 Modifier 求值器、时间天气系统和后端

## 兼容性

- 本地双击打开可运行
- GitHub Pages 兼容
- 老版本缺少新增字段的 JSON 在导入时会按默认值迁移
