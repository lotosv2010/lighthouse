(function (ready) {
  if(document.readyState === 'complete' || document.readyState === 'interactive') {
    ready();
  } else {
    document.addEventListener('readystatechange', () => {
      if(document.readyState === 'complete') {
        ready();
      }
    });
  }
})(function perf() {
  const data = {
    FP:  0,   // 首次绘制
    FCP: 0,   // 首次内容绘制
    LCP: 0,   // 最大内容绘制
    FID: 0,   // 首次交互延迟
    CLS: 0,   // 累积布局偏移
  };
  // 如果观察者观察到了指定类型的性能条目，就执行回调
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      if(entry.name === 'first-paint') {
        // 首次绘制的开始时间
        data.FP = entry.startTime;
        console.log('记录首次绘制(FP)', data.FP);
      } else if (entry.name === 'first-contentful-paint') {
        data.FCP = entry.startTime;
        console.log('记录首次内容绘制(FCP)', data.FCP);
      }
    });
  }).observe({ type: 'paint', buffered: true });
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      if(entry.startTime > data.LCP) {
        data.LCP = entry.startTime;
        console.log('记录最大内容绘制(LCP)', data.LCP);
      }
    });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      // 首次用户交互，开始处理的时间 减去 开始交互的时间，就是首次交互延迟的时间
      data.FID = entry.processingStart - entry.startTime;
      console.log('记录首次交互延迟(FID)', data.FID);
    });
  }).observe({ type: 'first-input', buffered: true });
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      data.CLS += entry.value;
      console.log('累积布局偏移(CLS)', data.CLS);
    });
  }).observe({ type: 'layout-shift', buffered: true });
});