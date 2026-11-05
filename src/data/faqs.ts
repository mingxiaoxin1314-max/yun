export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "2026年挑选机场梯子最看重哪些硬指标？",
    answer: "核心看三点：1. 线路类型（优先选IPLC/IEPL内网专线或优质BGP隧道，晚高峰不过大额公网路由，抗封锁更强）；2. 协议支持（推荐支持新型轻量低延迟协议如 Hysteria 2、VLESS-Reality 或 TUIC）；3. 节点冗余度与群控客服响应速度。切忌盲目年付超低价机场。"
  },
  {
    question: "为什么晚高峰会出现卡顿、丢包甚至断流？",
    answer: "普通直连机场走的是公网出口，每晚 20:00 - 23:00 国际出口带宽极度拥堵，QoS 限速严重。优质机场会采用企业级专线（IPLC），数据在境内进内网光纤直达境外机房，不经过公网防火墙与拥堵节点，因此延迟稳定且零丢包。"
  },
  {
    question: "新手使用 Clash Verge 或 Sing-box 订阅经常拉取失败怎么排查？",
    answer: "第一步检查系统时间是否同步（时间误差超 60 秒会导致 TLS 握手失败）；第二步确认订阅链接是否被本地运营商阻断，可在订阅设置中尝试开启代理拉取订阅；第三步联系机场后台查看节点订阅格式是否与当前客户端版本（如 Clash Meta 内核版本）兼容。"
  },
  {
    question: "购买机场后能否直接解锁 ChatGPT、Claude 与 Netflix 4K？",
    answer: "取决于节点的原生住宅 IP 或机房原生欺诈值。ChatGPT 和 Claude 对机房广播 IP 封控极严。推荐在机场节点列表中选择专门标有【OpenAI/ChatGPT 解锁】或【NF/Disney 解锁】的专属节点，并配合客户端规则分流。"
  }
];

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};
