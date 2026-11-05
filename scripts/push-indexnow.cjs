const https = require('https');

const KEY = 'e47a9d82cb144f8ea03d6521bc89f712';
const HOST = 'yunjichang.vip';

const urlsToSubmit = [
  `https://${HOST}/`,
  `https://${HOST}/posts/clash-verge-tutorial/`,
  `https://${HOST}/posts/vless-hysteria2-tuic-protocols/`,
  `https://${HOST}/posts/chatgpt-netflix-unlock-airport/`
];

const postData = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urlsToSubmit
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log(`[IndexNow] 正在向 IndexNow / Bing API 提交 ${urlsToSubmit.length} 个 URL...`);
const req = https.request(options, (res) => {
  console.log(`[IndexNow] 响应状态码: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('\n[IndexNow] ✅ URL 推送成功！Bing 爬虫已入队并准备抓取。');
    } else {
      console.log(`\n[IndexNow] ⚠️ 响应码 ${res.statusCode} (待域名 DNS 解析生效且在线后即可正式校验通过)`);
    }
  });
});

req.on('error', (e) => {
  console.error('[IndexNow] ❌ 推送请求失败:', e.message);
});

req.write(postData);
req.end();
