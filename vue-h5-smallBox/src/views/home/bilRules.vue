<template>
  <div class="bilRules">
    <van-form @submit="onSubmit">
      <van-field v-model="deviceSerialNo" name="deviceSerialNo" label="设备序列号" placeholder="设备序列号" />
      <van-field
        v-model="tempVehRule"
        name="tempVehRule"
        label="停留时长(分钟)"
        placeholder="临时车缴费后停留时长"
        :rules="[{ required: true, message: '临时车缴费后停留时长' }]"
      />
      <van-field name="fixVehRule" label="允许过期固定车入场">
        <template #input>
          <van-radio-group v-model="fixVehRule" direction="horizontal">
            <van-radio name="0">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field name="groupVehRule" label="允许集团车超出车位入场">
        <template #input>
          <van-radio-group v-model="groupVehRule" direction="horizontal">
            <van-radio name="0">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field name="feeRuleImage" label="费用规则图片">
        <template #input>
          <van-uploader max-count="1" v-model="feeRuleImage" />
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
import { createFeeRuleInfo, getFeeRuleInfo, uploadFile } from '@/api/home.js'
import Title from './components/title'
export default {
  components: {
    Title
  },
  data() {
    return {
      deviceSerialNo: '1108d79dc831f5f3ac1234', // 	String	是	设备序列号
      tempVehRule: '', // 	String	是	临时车提前缴费后，允许停留时长（单位：分钟）
      fixVehRule: '0', // 	String	是	允许过期固定车入场 （启用后过期固定车入场自动放行，并按照临时车计费）（0：否，1：是）
      groupVehRule: '0', // 	String	是	允许集团车超出车位入场 （启用后多位多车场景下，超出车位的车辆入场自动放行，并按临时车计费）（0：否，1：是）
      feeRuleImage: [], // 	String	是	费用规则图片
      remarks: '', // 	String	是	备注说明

      prePath: '/home/rate',
      nextPath: '/home/invoice',
      title: '计费',
      active: '3'
    }
  },
  mounted() {
    let invoiceFlag = sessionStorage.getItem('invoiceFlag')
    if (invoiceFlag == '0') {
      this.nextPath = '/home/index'
    }
    let deviceId = this.$route.query.deviceSerialNo
    if (deviceId) {
      this.deviceSerialNo = deviceId
      this.getFeeRuleInfo(deviceId)
    } else {
      this.deviceSerialNo = localStorage.getItem('deviceSerialNo')
      this.getFeeRuleInfo(this.deviceSerialNo)
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      this.createFeeRuleInfo(values)
    },
    initFeeRule(data) {
      let { deviceSerialNo, tempVehRule, fixVehRule, groupVehRule, feeRuleImage, remarks } = data

      this.deviceSerialNo = deviceSerialNo // 	String	是	设备序列号
      this.tempVehRule = tempVehRule // 	String	是	临时车提前缴费后，允许停留时长（单位：分钟）
      this.fixVehRule = fixVehRule // 	String	是	允许过期固定车入场 （启用后过期固定车入场自动放行，并按照临时车计费）（0：否，1：是）
      this.groupVehRule = groupVehRule // 	String	是	允许集团车超出车位入场 （启用后多位多车场景下，超出车位的车辆入场自动放行，并按临时车计费）（0：否，1：是）
      this.feeRuleImage = [{ url: feeRuleImage }] // 	String	是	费用规则图片
      this.remarks = remarks // 	String	是	备注说明
    },
    getFeeRuleInfo(deviceId) {
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getFeeRuleInfo(reqParams)
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
            reqParams.feeRuleImage = res.data
          }
        })
        .catch(res => {})
      createFeeRuleInfo(reqParams)
        .then(res => {
          if (res.code == '200') {
            this.$toast('配置成功')
            this.$router.push({ path: '/home/invoice', query: { ruleForm: this.ruleForm } })
            this.getFeeRuleInfo(this.deviceSerialNo)
          }
        })
        .catch(res => {
          this.$toast(res.msg || '配置失败')
        })
    },
    // 创建车道信息
    createFeeRuleInfo(values) {
      let { deviceSerialNo, tempVehRule, fixVehRule, groupVehRule, feeRuleImage, remarks } = values

      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 	String	是	设备序列号
        tempVehRule: tempVehRule, // 	String	是	临时车提前缴费后，允许停留时长（单位：分钟）
        fixVehRule: fixVehRule, // 	String	是	允许过期固定车入场 （启用后过期固定车入场自动放行，并按照临时车计费）（0：否，1：是）
        groupVehRule: groupVehRule, // 	String	是	允许集团车超出车位入场 （启用后多位多车场景下，超出车位的车辆入场自动放行，并按临时车计费）（0：否，1：是）
        // feeRuleImage: feeRuleImage[0].content, // 	String	是	费用规则图片
        remarks: remarks // 	String	是	备注说明
      }
      if (!feeRuleImage[0]) {
        this.$toast('请选择费用规则图片')
        return
      }
      let imgContent = feeRuleImage[0].content
      if (imgContent) {
        // 如果是本地上传
        this.compressPic(feeRuleImage[0], reqParams)
      } else {
        // 如果是数据回显（网址）
        let imageUrl = feeRuleImage[0].url
        reqParams.feeRuleImage = imageUrl
        this.callInter(reqParams)
      }
    },
    // 调用保存接口
    callInter(reqParams) {
      createFeeRuleInfo(reqParams)
        .then(res => {
          this.$toast('配置成功')
          this.$router.push({ path: '/home/invoice', query: { ruleForm: this.ruleForm } })
          this.getFeeRuleInfo(this.deviceSerialNo)
        })
        .catch(res => {})
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
    canvasPic(pic, scale) {
      let canvas = document.createElement('canvas') // 创建Canvas对象(画布)
      let context = canvas.getContext('2d')
      let img = new Image()
      img.src = pic.content // 指定图片的DataURL(图片的base64编码数据)
      canvas.width = 400
      canvas.height = 400
      context.drawImage(img, 0, 0, 400, 400)
      pic.content = canvas.toDataURL(pic.file.type, scale) // 0.92为默认压缩质量
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
