<template>
  <div class="map">
    <van-row type="flex" justify="center">
      <van-col span="10" offset="4">
        <van-uploader :max-size="1024 * 1024" @oversize="onOversize" v-model="fileList" max-count="1" :after-read="afterRead" />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="10" offset="0">
        <div class="description">上传设备二维码图片</div>
      </van-col>
    </van-row>
    <div style="margin: 16px">
      <!-- @click="createParkInfo" -->
      <!-- <van-button round block type="info" @click="submit">确认</van-button> -->
    </div>
  </div>
</template>

<script>
import { getQrUrl } from '../js/getQrUrl'
import { compressImg } from '../js/compressImage' // 图片压缩方法

export default {
  data() {
    return {
      deviceSerialNo: '',
      fileList: [] // 	String	是	车场商标(Base64数据)
    }
  },
  mounted() {},
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      if (file.file.size > 1048576) {
        let canvas = document.createElement('canvas') // 创建Canvas对象(画布)
        let context = canvas.getContext('2d')
        let img = new Image()
        img.src = file.content // 指定图片的DataURL(图片的base64编码数据)
        img.onload = () => {
          canvas.width = 400
          canvas.height = 300
          context.drawImage(img, 0, 0, 400, 300)
          // file.content = canvas.toDataURL(file.file.type, 0.92) // 0.92为默认压缩质量
          file.content = canvas.toDataURL(file.file.type, 0.1) // 0.92为默认压缩质量
        }
      } else {
        //小于1M直接上传
      }
      const result = getQrUrl(file.file)
      result
        .then(res => {
          if (res.data) {
            this.UrlSearchsr('deviceSerialNo', res.data)
            // deviceSerialNo
            this.$toast.success('识别成功!')
          } else {
            this.$toast.error('识别失败, 请重新上传')
          }
        })
        .catch(err => {
          this.$toast.fail('识别失败')
        })
    },
    UrlSearchsr(param, str) {
      var name, value
      // var str = location.href //取得整个地址栏
      var num = str.indexOf('?')
      str = str.substr(num + 1) //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split('&') //各个参数放到数组里
      console.log(arr)
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=')
        if (num > 0) {
          name = arr[i].substring(0, num)
          value = arr[i].substr(num + 1)
          if (name == param) {
            this.$emit('func', value)
          }
          // this[name] = value
        }
      }
    },
    onOversize(file) {
      console.log(file)
      this.$toast('文件大小不能超过 1024kb')
    },
    submit() {
      console.log(this.fileList[0])
      const result = getQrUrl(this.fileList[0].file)
      result
        .then(res => {
          if (res.data) {
            console.log(res.data)
            this.UrlSearchsr('deviceSerialNo', res.data)
            // deviceSerialNo
            this.$toast.success('识别成功!')
          } else {
            this.$toast.error('识别失败, 请重新上传')
          }
        })
        .catch(err => {
          this.$toast.fail('识别失败, 请重新上传')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.description {
  font-size: 16px;
}
</style>
