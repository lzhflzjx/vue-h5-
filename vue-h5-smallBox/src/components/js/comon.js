// 登录 压缩图片
export function canvasPic(pic, scale) {
  let canvas = document.createElement('canvas') // 创建Canvas对象(画布)
  let context = canvas.getContext('2d')
  let img = new Image()
  img.src = pic.content // 指定图片的DataURL(图片的base64编码数据)
  canvas.width = 400
  canvas.height = 400
  context.drawImage(img, 0, 0, 400, 400)
  pic.content = canvas.toDataURL(pic.file.type, scale) // 0.92为默认压缩质量
}

