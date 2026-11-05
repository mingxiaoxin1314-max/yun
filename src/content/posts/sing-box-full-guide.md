---
title: "Sing-box 全平台通用配置指南与订阅转换实战 (iOS/Android/Windows/macOS)"
description: "深度介绍新一代通用代理核心 Sing-box 的安装使用、JSON 规则配置、机场订阅拉取及 Tun 模式透明代理设置，告别臃肿客户端。"
pubDate: 2026-09-15
author: "云机场技术组"
tags: ["Sing-box", "跨平台", "客户端教程", "通用核心", "Hysteria2"]
badge: "新一代核心"
category: "client"
faqs:
  - q: "Sing-box 相比 Clash Verge 核心最大的优势是什么？"
    a: "核心优势在于代码极度轻量与内存占用极低。Sing-box 纯 Go 语言开发，不依赖 Chromium 渲染环境，常驻内存仅约 20MB；同时对最新抗封锁协议（如 Reality 握手特征、Hysteria 2、TUIC v5）的社区适配和修复响应速度全网最快。"
  - q: "为什么部分机场提供的通用订阅链接无法直接在 Sing-box 导入？"
    a: "Sing-box 采用全新的模块化 JSON 配置结构，与传统 Clash 的 YAML 格式或 V2Ray 的多行 base64 格式不兼容。若机场后台未提供专用的【Sing-box 订阅】，可利用开源订阅转换工具将其一键转换为标准的 Sing-box 远程配置。"
  - q: "在 Windows 系统开启 Sing-box Tun 网卡提示权限不足怎么解决？"
    a: "Windows 建立虚拟网卡必须获得系统网络驱动级权限，请退出客户端，鼠标右键点击 Sing-box 快捷方式选择「以管理员身份运行」即可。"
---

在经历了传统客户端更迭后，由开源社区驱动的 **Sing-box（通用代理平台）** 凭借极致的代码性能、原生对新协议（Shadowsocks、VMess、VLESS-Reality、Hysteria 2、TUIC v5、WireGuard）的秒级支持，迅速成为极客与资深网络玩家的新宠。

Sing-box 彻底打通了 **iOS、Android、Windows、macOS 以及 Linux** 的全平台体验，核心内存占用通常仅在 20MB 左右，远低于传统 Electron 客户端。

---

## 一、各平台客户端获取渠道

- **iOS / iPadOS**：App Store 搜索 `Sing-box`（免费下载，需外区 Apple ID）。
- **Android**：Google Play 商店或前往官方 GitHub Release 页面下载 APK 安装包。
- **Windows / macOS**：
  - 图形界面版：推荐使用官方 GUI 客户端或基于 Sing-box 内核包装的轻量 GUI（如 Karing / GUI.for.Sing-box）。

---

## 二、导入机场订阅的三种实用方式

### 方式 1：原生 Sing-box 订阅导入（推荐）
随着 Sing-box 的普及，主流正规机场（如 [首页 2026 稳定机场推荐总榜](/#ranking)）现均已直接提供 `sing-box 订阅链接`：
1. 打开客户端，切换至 **「Profiles (配置)」**。
2. 点击 **「New (新建)」**，类型选择 **「Remote (远程订阅)」**。
3. 填入你的 Sing-box 专用订阅 URL，开启 **「Auto Update (自动更新)」**。
4. 点击保存后下载配置，切换回主面板选择节点即可连接。

### 方式 2：使用在线后端进行订阅格式转换
如果你的机场只提供了 Clash 或 V2Ray 订阅，可通过开源订阅转换平台将其转换输出为 Sing-box JSON 格式：
- 输入源订阅链接，客户端类型选择 **Sing-box**。
- 将转换生成的 URL 导入至 Sing-box 客户端即可。

---

## 三、Sing-box 核心配置解析（给极客的建议）

Sing-box 采用模块化的 JSON 结构，主要包含三大板块：
1. **Inbounds (入站)**：
   - 包含本地 `mixed`（Socks5 + HTTP 混合端口）以及企业级 `tun` 模式网卡。
2. **Outbounds (出站)**：
   - 你的机场节点列表、`urltest`（自动测速优选节点组）以及 `selector`（手动节点切换组）。
3. **Route (路由分流)**：
   - 基于 GeoIP 和 GeoSite 的精准分流，确保国内流量走 `direct`，广告走 `block`，外网走目标节点。

---

## 四、Tun 虚拟网卡透明代理注意事项

在 Windows 或 macOS 下开启 Tun 模式时：
- 务必以 **管理员权限** 运行 Sing-box，否则无法在系统中创建虚拟网络适配器。
- 在 `route` 设置中建议启用 `auto_detect_interface: true`，以便在网络环境从有线网切换到 Wi-Fi 时自动修复路由表。

---

## 五、科学上网进阶矩阵与延伸阅读

- 🍏 **iOS 专属轻量首选**：阅读 [2026 小火箭 (Shadowrocket) iOS 节点导入与规则分流新手实操指南](/posts/shadowrocket-ios-tutorial/)。
- 🖥️ **Windows/macOS 图形主力**：阅读 [2026 最新 Clash Verge Rev 客户端配置指南](/posts/clash-verge-tutorial/)。
- ⚡ **协议底层机制剖析**：阅读 [2026 主流科学上网协议深度解析：VLESS-Reality、Hysteria 2 与 TUIC 性能评测](/posts/vless-hysteria2-tuic-protocols/)。
- 🚀 **专线实测**：直达 [2026 稳定机场推荐总榜 (IPLC 专线)](/#ranking)，体验晚高峰零丢包专线。

