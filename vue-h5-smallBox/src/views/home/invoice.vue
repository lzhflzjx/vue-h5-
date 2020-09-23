<template>
  <div class="invoice">
    <van-form @submit="onSubmit">
      <AreaList @func="getAreaCode" :array="areaArray"></AreaList>
      <van-field
        v-model="deviceSerialNo"
        name="deviceSerialNo"
        label="设备序列号"
        placeholder="设备序列号"
        :rules="[{ required: true, message: '请输入设备序列号' }]"
      />
      <van-field
        readonly
        type="tel"
        v-model="userName"
        name="userName"
        label="登录手机账号"
        placeholder="请填写手机号"
      />
      <van-field
        v-model="taxpayerNum"
        name="taxpayerNum"
        label="纳税人识别号"
        placeholder="纳税人识别号"
        :rules="[{ required: true, message: '请输入纳税人识别号' }]"
      />
      <van-field
        v-model="enterpriseName"
        name="enterpriseName"
        label="企业名称"
        placeholder="企业名称"
        :rules="[{ required: true, message: '请输入企业名称' }]"
      />
      <van-field
        v-model="legalPersonName"
        name="legalPersonName"
        label="法人姓名"
        placeholder="法人姓名"
        :rules="[{ required: true, message: '请输入法人姓名' }]"
      />
      <van-field
        v-model="contactsName"
        name="contactsName"
        label="联系人姓名"
        placeholder="联系人姓名"
        :rules="[{ required: true, message: '请输入联系人姓名' }]"
      />
      <van-field
        v-model="contactsEmail"
        name="contactsEmail"
        label="联系人邮箱"
        placeholder="联系人邮箱"
        :rules="[
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            required: true,
            message: '邮箱格式不正确 例如100000@qq.com'
          }
        ]"
      />
      <!-- <van-field
        type="tel"
        v-model="contactsPhone"
        name="contactsPhone"
        label="联系人电话"
        placeholder="请填写手机号"
        :rules="[{ pattern: /^1[3456789]\d{9}$/, required: true, message: '手机号格式不正确' }]"
      />-->
      <!-- <van-field
        v-model="regionCode"
        name="regionCode"
        label="地区编码"
        placeholder="地区编码"
        :rules="[{ required: true, message: '请输入地区编码' }]"
      />-->
      <van-field
        v-model="cityName"
        name="cityName"
        label="城市名称"
        placeholder="城市名称"
        :rules="[{ required: true, message: '请输入城市名称' }]"
      />
      <van-field
        v-model="enterpriseAddress"
        name="enterpriseAddress"
        label="企业地址"
        placeholder="企业地址"
        :rules="[{ required: true, message: '请输入企业地址' }]"
      />
      <van-field name="taxRegistImage" label="税务登记证图片">
        <template #input>
          <van-uploader
            @oversize="onOversize"
            max-count="1"
            v-model="taxRegistImage"
          />
        </template>
      </van-field>
      <van-field v-model="remarks" name="remarks" label="备注" placeholder="备注" />
      <div class="submition">
        <van-button size="small" block type="info" native-type="submit">提交</van-button>
        <Title :prePath="prePath" :nextPath="nextPath" :active="active" :title="title"></Title>
      </div>
    </van-form>
  </div>
</template>

<script>
import { createInvoiceInfo, getInvoiceInfo, uploadFile } from '@/api/home.js'
import Title from './components/title'
import AreaList from './components/AreaList'
export default {
  components: {
    Title,
    AreaList
  },
  data() {
    return {
      deviceSerialNo: '', // 	String	是	设备序列号
      taxpayerNum: '', // 	String	是	纳税人识别号
      enterpriseName: '', // 	String	是	企业名称
      legalPersonName: '', // 	String	是	法人姓名
      contactsName: '', // 	String	是	联系人姓名
      contactsEmail: '', // 	String	是	联系人邮箱
      contactsPhone: '', // 	String	是	联系人电话
      regionCode: '', // 	String	是	地区编码
      cityName: '', // 	String	是	城市名称
      enterpriseAddress: '', // 	String	是	企业地址
      taxRegistImage: [], // 	String	是	税务登记证图片(Base64数据)
      remarks: '', // 	String	否	备注信息
      userName: '', // 	String	是	操作人员（登录手机账号）

      prePath: '/home/bilRules',
      nextPath: '/home/index',
      title: '电子发票',
      active: '4',

      areaArray: []
    }
  },
  created() {
    this.userName = localStorage.getItem('phone-M') || localStorage.getItem('phone-A')
  },
  mounted() {
    let deviceId = this.$route.query.deviceSerialNo
    if (deviceId) {
      this.deviceSerialNo = deviceId
      this.getInvoiceInfo(deviceId)
    } else {
      this.deviceSerialNo = localStorage.getItem('deviceSerialNo')
      this.getInvoiceInfo(this.deviceSerialNo)
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      this.createInvoiceInfo(values)
    },
    initFeeRule(data) {
      let {
        deviceSerialNo,
        taxpayerNum,
        enterpriseName,
        legalPersonName,
        contactsName,
        contactsEmail,
        contactsPhone,
        regionCode,
        cityName,
        enterpriseAddress,
        remarks,
        userName,
        taxRegistImage
      } = data
      if (regionCode) {
        let array = regionCode.split(',')
        this.areaArray = array
        this.regionCode = array[2]
      }
      this.deviceSerialNo = deviceSerialNo //	String	是	设备序列号
      this.taxpayerNum = taxpayerNum // 	String	是	纳税人识别号
      this.enterpriseName = enterpriseName // 	String	是	企业名称
      this.legalPersonName = legalPersonName // 	String	是	法人姓名
      this.contactsName = contactsName // 	String	是	联系人姓名
      this.contactsEmail = contactsEmail // 	String	是	联系人邮箱
      this.contactsPhone = contactsPhone // 	String	是	联系人电话
      // this.regionCode = regionCode // 	String	是	地区编码
      this.cityName = cityName // 	String	是	城市名称
      this.enterpriseAddress = enterpriseAddress // 	String	是	企业地址
      this.remarks = remarks // 	String	否	备注信息
      this.userName = userName // 	String	是	操作人员（登录手机账号）
      this.taxRegistImage = [{ url: taxRegistImage }] // 	String	是	税务登记证图片(Base64数据)
      this.remarks = remarks // 	String	是	备注说明
    },
    getInvoiceInfo(deviceId) {
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getInvoiceInfo(reqParams)
        .then(res => {
          if (res.code == '200' && res.data) {
            this.initFeeRule(res.data)
          }
        })
        .catch(res => {})
    },
    // 上传图片
    async uploadFile(values, reqParams) {
      let reqImage = {
        image: values.replace(/.*;base64,/, '')
      }
      await uploadFile(reqImage)
        .then(res => {
          if (res.code == 200) {
            reqParams.taxRegistImage = res.data
          }
        })
        .catch(res => {})
      createInvoiceInfo(reqParams)
        .then(res => {
          this.$toast('配置成功')
          this.$router.push({ path: '/home/index', query: { deviceSerialNo: this.deviceSerialNo } })
        })
        .catch(res => {})
    },
    // 创建车道信息
    createInvoiceInfo(values) {
      let {
        deviceSerialNo,
        userName,
        taxpayerNum,
        enterpriseName,
        legalPersonName,
        contactsName,
        contactsEmail,
        contactsPhone,
        cityName,
        enterpriseAddress,
        taxRegistImage,
        remarks
      } = values

      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 	String	是	设备序列号
        taxpayerNum: taxpayerNum, // 	String	是	纳税人识别号
        enterpriseName: enterpriseName, // 	String	是	企业名称
        legalPersonName: legalPersonName, // 	String	是	法人姓名
        contactsName: contactsName, // 	String	是	联系人姓名
        contactsEmail: contactsEmail, // 	String	是	联系人邮箱
        contactsPhone: userName, // 	String	是	联系人电话
        regionCode: this.regionCode, // 	String	是	地区编码
        cityName: cityName, // 	String	是	城市名称
        enterpriseAddress: enterpriseAddress, // 	String	是	企业地址
        taxRegistImage: taxRegistImage, // 	String	是	税务登记证图片(Base64数据)
        remarks: remarks, // 	String	否	备注信息
        userName: userName // 	String	是	操作人员（登录手机账号）
      }

      if (!taxRegistImage[0]) {
        this.$toast('请选择税务图片')
        return
      }
      let imgContent = taxRegistImage[0].content
      if (imgContent) {
        // 如果是本地上传
        this.compressPic(taxRegistImage[0], reqParams)
      } else {
        // 如果是数据回显（网址）
        let imageUrl = taxRegistImage[0].url
        reqParams.taxRegistImage = imageUrl
        this.callInter(reqParams)
      }
      // let imgContent = taxRegistImage[0].content

      // if (imgContent) {
      //   this.uploadFile(imgContent, reqParams)
      // } else {
      //   let imageUrl = taxRegistImage[0].url
      //   reqParams.taxRegistImage = imageUrl

      //   createInvoiceInfo(reqParams)
      //     .then(res => {
      //       this.$toast('配置成功')
      //       this.$router.push({ path: '/home/index', query: { deviceSerialNo: this.deviceSerialNo } })
      //     })
      //     .catch(res => {})
      // }
    },
    compressPic(pic, reqParams) {
      if (1048576 < pic.file.size < 542880) {
        // 大于1M压缩小于5M
        console.log('大于1M压缩小于5M')
        this.canvasPic(pic, 0.4)
        this.uploadFile(pic.content, reqParams)
      } else if (542880 < pic.file.size < 10485760) {
        // 大于5M压缩小于10M
        console.log('大于5M压缩小于10M')
        this.canvasPic(pic, 0.2)
        this.uploadFile(pic.content, reqParams)
      } else if (10485760 < pic.file.size) {
        // 大于10M
        console.log('大于10M')
        this.canvasPic(pic, 0.1)
        this.uploadFile(pic.content, reqParams)
      } else {
        //小于1M直接上传
        this.uploadFile(pic.content, reqParams)
      }
    },
    // 调用保存接口
    callInter(reqParams) {
      createInvoiceInfo(reqParams)
        .then(res => {
          this.$toast('配置成功')
          this.$router.push({ path: '/home/index', query: { deviceSerialNo: this.deviceSerialNo } })
        })
        .catch(res => {})
    },
    canvasPic(pic, scale) {
      let canvas = document.createElement('canvas') // 创建Canvas对象(画布)
      let context = canvas.getContext('2d')
      let img = new Image()
      img.src = pic.content // 指定图片的DataURL(图片的base64编码数据)
      canvas.width = 400
      canvas.height = 400
      context.drawImage(img, 0, 0, 400, 400)
      pic.content = canvas.toDataURL(pic.file.type, scale) // 0.92为默认压缩质量
    },
    onOversize(file) {
      console.log(file)
      this.$toast('文件大小不能超过 500kb')
    },
    // 拿到地区编码
    getAreaCode(value) {
      this.regionCode = value
    }
  }
}
</script>

<style scoped lang="scss">
.submition {
  margin: 16px 0;
}
/deep/.van-button--block {
  display: block;
  width: 50%;
  margin: auto;
}
</style>
