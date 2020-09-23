<template>
  <div class="upload">
    <van-uploader
      :after-read="onRead"
      :before-read="beforeRead"
      v-model="fileList"
      accept=".jpg, .jpeg, .png, .bmp"
      :max-count="2"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [], // 回显图片
      imagePath: [] // 上传图片路径
    }
  },
  mounted() {},
  methods: {
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为file文件
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    beforeRead(file) {
      // 上传之前检测图片类似返回true和false会影响到onRead函数
      let regex = /(.jpg|.jpeg|.png|.bmp)$/
      if (!regex.test(file.type)) {
        Toast('图片格式不支持上传')
        return false
      } else {
        return true
      }
    },
    onRead(file) {
      console.log('file')
      console.log(file)
      // 上传图片
      // 大于10MB的图片都缩小像素上传
      // 10485760
      if (file.file.size > 2097152) {
        console.log('1171')
        let canvas = document.createElement('canvas') // 创建Canvas对象(画布)
        let context = canvas.getContext('2d')
        let img = new Image()
        img.src = file.content // 指定图片的DataURL(图片的base64编码数据)
        img.onload = () => {
          canvas.width = 400
          canvas.height = 300
          context.drawImage(img, 0, 0, 400, 300)
          // file.content = canvas.toDataURL(file.file.type, 0.92) // 0.92为默认压缩质量
          file.content = canvas.toDataURL(file.file.type, 0.6) // 0.92为默认压缩质量
          console.log('Hasfile')
          console.log(file)
          // let files = this.dataURLtoFile(file.content, file.file.name)
          // const data = new FormData()
          // data.append('file', files)
          // data.append('code', this.applyNo)
          // data.append('type', 'chat')
          // apiUpload(data).then(res => {
          //   this.imagePath.push(res.data.reqUrl)
          //   Toast('上传成功')
          // })
        }
      } else {
        //小于10M直接上传
        const data = new FormData()
        data.append('file', file.file)
        data.append('code', this.applyNo)
        data.append('type', 'chat')
        // apiUpload(data).then(res => {
        //   this.imagePath.push(res.data.reqUrl)
        //   Toast('上传成功')
        // })
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
