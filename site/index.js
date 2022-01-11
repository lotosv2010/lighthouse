const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const delayConfig = require('./delayConfig');

const app = express();
app.use(logger('dev'));
app.use((req, res, next) => {
  const url = req.url;
  const delay = delayConfig[url];
  if(delay) {
    setTimeout(next, delay);
  } else {
    next();
  }
});
// 启用gzip压缩
app.use(compression());
app.use(express.static('public'));
app.listen(9090, () => console.log(`服务器已经在9090端口上启动了...`));