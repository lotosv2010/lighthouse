// 运行代码后，访问/performance会返回掘金主站的性能分析结果
const Koa = require('koa');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require("fs");
const path = require('path');
const moment = require('moment');

const app = new Koa();

const launchChromeAndRunLighthouse = async (url, opts, config = null) => {
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance"],
    quiet: true,
    locale: 'zh',
    ...opts,
  };
  // 打开 chrome debug
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
  // 开始分析
  const runnerResult = await lighthouse(
    url,
    { ...options, port: chrome.port },
    config
  );
  await chrome.kill();
  // 生成报告
  const reportHtml = runnerResult.report;
  fs.writeFileSync(path.join(__dirname, 'reports', `${moment().format('YYYY-MM-DD_HH-mm-ss')}.report.html`), reportHtml);
  return reportHtml;
};

app.use(async (ctx, next) => {
  if(ctx.path.match('/performance')) {
    const opts = {
      chromeFlags: ["--show-paint-rects"],
      preset: "desktop",
    };
    const report = await launchChromeAndRunLighthouse(
      'http://localhost:9090', 
      opts
    );
    ctx.body = report;
    return;
  }
  return next();
});
// 启动
app.listen(9091)
