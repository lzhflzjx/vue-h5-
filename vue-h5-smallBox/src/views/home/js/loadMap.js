/**
 * 加载地图
 * @param {Function} callback 回调函数名称，回调函数将会挂载到window上，例如：window.initBaiduMapScript，在方法中就能拿到BMap对象
 */
export function loadBMap(callback) {
  var script = document.createElement('script')
  script.src = 'https://api.map.baidu.com/api?v=2.0&ak=0ygXfl7ly2mXSpNU542oXIYUB7L9GTx3&callback=' + callback
  document.body.appendChild(script)
}
