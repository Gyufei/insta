# 任何项目都务必遵守的规则（极其重要！！！）

## Communication

- 永远使用简体中文进行思考和对话

## Documentation

- 编写 .md 文档时，也要用中文
- 正式文档写到项目的 docs/ 目录下
- 用于讨论和评审的计划、方案等文档，写到项目的 discuss/ 目录下

## React / Next.js / TypeScript / JavaScript

- React 强制使用 v19 版本，不要再用 v18 或以下版本
- Tailwind CSS 强制使用 Tailwind CSS v4。不要再用 v3 或以下版本
- 尽可能使用 TypeScript。只有在构建工具完全不支持 TypeScript 的时候，才使用 JavaScript（如微信小程序的主工程）
- 数据结构尽可能全部定义成强类型。如果个别场景不得不使用 any 或未经结构化定义的 json，需要先停下来征求用户的同意
- 注释都需要英文，不能用中文
