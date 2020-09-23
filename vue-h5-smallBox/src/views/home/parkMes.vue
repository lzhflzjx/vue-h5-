<template>
  <div class="parkMes">
    <!-- <van-button @click="clear">清除缓存</van-button> -->
    <!-- <van-nav-bar v-if="!accessToken" title="车场信息设置" @click-right="onClickRight1">
      <template #right>
        <span class="login">登录</span>
        <van-icon name="user-o" size="20" />
      </template>
    </van-nav-bar>
    <van-nav-bar v-else title="车场信息设置" @click-right="onClickRight2">
      <template #right>
        <span class="login">退出</span>
        <van-icon name="user-o" size="20" />
      </template>
    </van-nav-bar>-->
    <!-- 遮罩层 -->
    <van-overlay :show="show" z-index="999">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#1989fa" size="36px" />
      </div>
    </van-overlay>

    <van-form @submit="onSubmit" ref="parkSubmit">
      <AreaList @func="getAreaCode" :array="areaArray"></AreaList>
      <van-field
        v-model="address"
        name="address"
        label="车场地址"
        placeholder="请输入车场地址"
        :rules="[{ required: true, message: '请填写车场地址' }]"
      />
      <van-field
        readonly
        v-model="deviceSerialNo"
        name="deviceSerialNo"
        label="设备序列号"
        placeholder="请输入设备序列号"
        :rules="[{ required: true, message: '没有获取到设备号，请重新扫码' }]"
      >
        <!-- <template #button>
          <van-icon class="help" name="photo-o" @click="getMsgRight" />
        </template>-->
      </van-field>
      <van-field readonly v-model="agentId" name="agentId" label="代理商">
        <template #button>
          <van-button
            v-if="accessToken && bindFlag && !accessTokenM"
            @click="bindAgent"
            native-type="button"
            type="info"
            size="mini"
          >绑定</van-button>
        </template>
      </van-field>
      <!-- <van-field
        readonly
        clickable
        label="车场类型选择"
        :value="parkTypeName"
        placeholder="请选择车场类型"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="parkColumns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>-->
      <!-- :readonly="parkNameFlag" -->
      <van-field
        v-model="parkName"
        name="parkName"
        label="车场名称"
        placeholder="请输入车场名称"
        :rules="[{ required: true, message: '请填写车场名称' }]"
      />
      <van-field
        v-model="contactPerson"
        name="contactPerson"
        label="联系人"
        placeholder="请填写联系人"
        :rules="[{ required: true, message: '请填写联系人' }]"
      />
      <van-field
        readonly
        type="tel"
        v-model="contactPhoneNum"
        name="contactPhoneNum"
        label="联系电话"
        placeholder="请填写手机号"
        :rules="[{ pattern, required: true, message: '请输入正确手机号' }]"
      />

      <!-- <van-field type="tel" v-model="coordinateLng" name="coordinateLng" label="经度坐标">
        <template #button>
          <van-icon class="help" name="setting-o" @click="showPopup" />
        </template>
      </van-field>
      <van-field type="tel" v-model="coordinateLat" name="coordinateLat" label="纬度坐标" />-->
      <van-field
        type="tel"
        v-model="totalCount"
        name="totalCount"
        label="总车位数"
        placeholder="请填写总车位数"
        :rules="[{ required: true, message: '请填写总车位数' }]"
      />
      <!-- <van-icon class="help" name="setting-o" @click="setPay" /> -->
      <!-- <van-field name="payType" label="支付方式">
        <template #input>
          <van-radio-group v-model="payType" direction="horizontal">
            <van-radio name="1">微信或支付宝</van-radio>
            <van-radio name="2">建行支付</van-radio>
           
          </van-radio-group>
        </template>
      </van-field>-->
      <van-field name="invoiceFlag" label="电子发票">
        <template #input>
          <van-radio-group v-model="invoiceFlag" direction="horizontal">
            <van-radio name="0">不需要</van-radio>
            <van-radio name="1">需要</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- <van-field name="wxSubscribeFlag" label="关注公众号">
        <template #input>
          <van-radio-group v-model="wxSubscribeFlag" direction="horizontal">
            <van-radio name="0">不关注</van-radio>
            <van-radio name="1">关注</van-radio>
          </van-radio-group>
        </template>
      </van-field>-->
      <van-field v-show="false" name="logo" label="车场logo">
        <template #input>
          <van-uploader
            :max-size="1024 * 1024"
            @oversize="onOversize"
            max-count="1"
            v-model="logo"
          />
        </template>
      </van-field>
      <van-field type="tel" v-model="remarks" name="remarks" label="备注" placeholder="请填写备注" />
      <div style="margin: 16px">
        <van-button size="small" block type="info" native-type="submit">
          <span v-if="stepFlag">修改</span>
          <span v-else>提交</span>
        </van-button>
      </div>
      <div v-if="stepFlag" style="margin: 16px">
        <van-button size="small" @click="toNext()" block type="info" native-type="button">下一步</van-button>
      </div>
    </van-form>
    <van-popup v-model="bindShow" closeable position="top" :style="{ height: '30%' }">
      <Bind class="BindDevice" @func="getMsgDevice"></Bind>
    </van-popup>
    <!-- 地图 -->
    <van-popup
      v-model="Popup"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="mainMap1">
        <Map @func="selectLng"></Map>
      </div>
    </van-popup>
  </div>
  <!-- </van-pull-refresh> -->
</template>

<script>
import Bind from './components/bind'
import Map from './components/map'
import AreaList from './components/AreaList'
import { getDeviceList, createParkInfo, getParkInfo, getParkTypeList, getAreaList, uploadFile } from '@/api/home.js'
export default {
  components: {
    Bind,
    Map,
    AreaList
  },
  data() {
    return {
      accessTokenM: '',
      parkNameFlag: false,
      location: '北京',
      keyword: '百度',

      show: false, //遮罩
      isLoading: false, //下拉刷新
      username: '',
      password: '',
      parkStyle: '出口',

      deviceSerialNo: '',
      parkName: '',
      address: '',
      parkId: '',
      parkTypeId: '',
      parkTypeName: '',
      areaCode: '',
      contactPerson: '',
      contactPhoneNum: '',
      coordinateLng: 116.40387397,
      coordinateLat: 39.91488908,
      payType: '1',
      totalCount: '1000',
      invoiceFlag: '0',
      wxSubscribeFlag: '0',
      logo: [{ url: 'https://leting360-prod.oss-cn-hangzhou.aliyuncs.com/logo/logo_leting.png' }], // 	String	是	车场商标(Base64数据)
      remarks: '',
      agentId: '',

      showPicker: false,
      parkColumns: [{ text: '选择省', value: '1' }],

      pattern: /^1[3456789]\d{9}$/,

      Popup: false,
      bindShow: false,

      bindFlag: false,
      stepFlag: false,
      accessToken: '',
      areaArray: []
    }
  },
  created() {
    this.accessToken = localStorage.getItem('accessToken-A')
    this.accessTokenM = localStorage.getItem('accessToken-M')
    this.contactPhoneNum = localStorage.getItem('phone-M') || localStorage.getItem('phone-A')
  },
  mounted() {
    let queryDevice = this.$route.query.deviceSerialNo
    if (queryDevice) {
      this.deviceSerialNo = queryDevice
      this.getParkInfo(queryDevice)
    } else {
      this.agentId = localStorage.getItem('agentId-A')
      let deviceId = localStorage.getItem('deviceSerialNo')
      if (deviceId != 'undefined' && deviceId) {
        this.deviceSerialNo = deviceId
        this.getParkInfo(deviceId)
      } else {
        this.deviceSerialNo = ''
        this.getParkInfo(this.deviceSerialNo)
      }
    }
  },
  methods: {
    clear() {
      localStorage.clear()
      this.$toast('本地缓存已清除')
    },
    onSubmit(values) {
      console.log('submit', values)
      this.createParkInfo(values)
    },
    onConfirm(value) {
      this.parkTypeName = value.text
      this.parkTypeId = value.value
      this.showPicker = false
    },
    // 回显车场信息
    initParkMes({
      parkName,
      address,
      contactPerson,
      contactPhoneNum,
      coordinateLat,
      coordinateLng,
      deviceSerialNo,
      agentId,
      payType,
      logo,
      remarks,
      totalCount,
      areaCode,
      parkTypeId,
      wxSubscribeFlag,
      invoiceFlag,
      parkId
    }) {
      if (areaCode) {
        let array = areaCode.split(',')
        this.areaArray = array
        this.areaCode = array[2]
      }

      this.parkName = parkName
      this.parkId = parkId
      this.address = address
      this.contactPerson = contactPerson
      this.contactPhoneNum = contactPhoneNum
      this.coordinateLat = coordinateLat
      this.coordinateLng = coordinateLng
      this.deviceSerialNo = deviceSerialNo
      this.agentId = agentId
      sessionStorage.setItem('payType', payType) // 存入支付类型
      this.payType = payType
      this.wxSubscribeFlag = wxSubscribeFlag
      this.invoiceFlag = invoiceFlag
      sessionStorage.setItem('invoiceFlag', invoiceFlag) // 存入是否使用电子发票
      if (logo) {
        this.logo = [{ url: logo }] // 	String	是	车场商标(Base64数据)
      } else {
        this.logo = [{ url: 'https://leting360-prod.oss-cn-hangzhou.aliyuncs.com/logo/logo_leting.png' }] // 	String	是	车场商标(Base64数据)
      }
      this.remarks = remarks
      this.totalCount = totalCount
      this.getParkTypeList(parkTypeId)

      this.show = false
      this.isLoading = false
    },
    // 获取车场信息接口
    getParkInfo(deviceId) {
      if (deviceId) {
        localStorage.setItem('deviceSerialNo', deviceId)
      }
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      this.show = true
      this.isLoading = true
      getParkInfo(reqParams)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.bindFlag = true
            this.parkNameFlag = true
            this.stepFlag = true
            this.initParkMes(res.data)
          } else {
            this.show = false
            this.isLoading = false
          }
        })
        .catch(res => {
          this.show = false
          this.isLoading = false
        })
    },
    // 创建车场信息接口
    createParkInfo(values) {
      let {
        address,
        parkName,
        deviceSerialNo,
        agentId,
        coordinateLng,
        coordinateLat,
        wxSubscribeFlag,
        invoiceFlag,
        payType,
        contactPhoneNum,
        contactPerson,
        logo,
        remarks,
        totalCount
      } = values
      if (this.areaCode == '') {
        this.$toast('请选择区域')
        return
      }
      // if (this.parkTypeId == '') {
      //   this.$toast('请选择车场类型')
      //   return
      // }
      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 	String	是	设备序列号
        parkName: parkName, // 	String	是	车场名称
        agentId: this.agentId, // 	String	是	代理商Id
        parkId: this.parkId, // 	String	是	车场id
        parkTypeId: this.parkTypeId || '6', // 	String	是	车场类型
        areaCode: this.areaCode, // 	String	是	所属区域
        contactPhoneNum: contactPhoneNum, // 	String	是	联系电话
        contactPerson: contactPerson, // 	String	是	联系人
        address: address, // 	String	是	车场地址
        coordinateLng: 116.40387397, // 	String	是	经度坐标
        coordinateLat: 39.91488908, // 	String	否	纬度坐标
        totalCount: totalCount, // 	String	否	总车位数
        payType: '2', // 	String	是	支付方式（1：微信或支付宝，2：建行支付）
        invoiceFlag: invoiceFlag, // 	String	否	是否开电子发票（0：不需要，1：需要）
        wxSubscribeFlag: '0', // 	String	否	是否关注公众号（0：不关注，1：关注）
        logo: logo, // 	String	是	车场商标(Base64数据)
        remarks: remarks // 	String	否	备注信息
      }
      if (!logo[0]) {
        reqParams.logo = 'https://leting360-prod.oss-cn-hangzhou.aliyuncs.com/logo/logo_leting.png'
        createParkInfo(reqParams)
          .then(res => {
            if (res.code == '200') {
              this.$toast('配置成功')
              this.$router.push({ path: '/home/parkAuth', query: { deviceSerialNo: this.deviceSerialNo } })
            }
            this.getParkInfo(this.deviceSerialNo)
          })
          .catch(err => {
            this.$toast(err.msg || '配置失败')
          })
        return
      } else {
        let imgContent = logo[0].content
        if (imgContent) {
          this.uploadFile(imgContent, reqParams)
        } else {
          let imageUrl = logo[0].url
          reqParams.logo = imageUrl
          createParkInfo(reqParams)
            .then(res => {
              if (res.code == '200') {
                this.$toast('配置成功')
                this.$router.push({ path: '/home/parkAuth', query: { deviceSerialNo: this.deviceSerialNo } })
              }
              this.getParkInfo(this.deviceSerialNo)
            })
            .catch(err => {
              this.$toast(err.msg || '配置失败')
            })
        }
      }
    },
    // 上传图片
    async uploadFile(values, reqParams) {
      let reqImage = {
        image: values.replace(/.*;base64,/, '')
      }
      await uploadFile(reqImage)
        .then(res => {
          if (res.code == 200) {
            reqParams.logo = res.data
          }
        })
        .catch(res => {})
      createParkInfo(reqParams)
        .then(res => {
          if (res.code == '200') {
            localStorage.setItem('deviceSerialNo', this.deviceSerialNo)
            this.$toast('配置成功')
            this.$router.push({ path: '/home/parkAuth', query: { deviceSerialNo: this.deviceSerialNo } })
          }
          this.getParkInfo(this.deviceSerialNo)
        })
        .catch(err => {
          this.$toast(err.msg || '配置失败')
        })
    },
    // 获取车场类型下拉列表接口
    getParkTypeList(value) {
      getParkTypeList()
        .then(res => {
          let array = []
          res.data.forEach(element => {
            array.push({
              text: element.parkTypeName,
              value: element.parkTypeId
            })
            if (value && value == element.parkTypeId) {
              this.parkTypeName = element.parkTypeName
              this.parkTypeId = element.parkTypeId
            }
          })
          this.parkColumns = array
        })
        .catch()
    },
    // 拿到地区编码
    getAreaCode(value) {
      this.areaCode = value
    },
    onRefresh() {
      // this.getParkInfo()
    },
    onClickRight1() {
      this.$router.push({ path: '/home/login', query: { ruleForm: this.ruleForm } })
    },
    onClickRight2() {
      this.$dialog
        .confirm({
          title: '退出登录',
          message: '确定要退出吗？'
        })
        .then(() => {
          // on confirm
          localStorage.clear()
          this.$router.go(0)
        })
        .catch(() => {
          // on cancel
        })
    },
    getMsgRight() {
      this.bindShow = true
    },
    getMsgDevice(deviceId) {
      this.deviceIdEncoding(deviceId)
    },
    // 设备转码接口
    deviceIdEncoding(deviceId) {
      this.$axios
        .get(`https://parktest.leting360.cn/GetTollUniqueEncoding?ArmUniqueID=${deviceId}`)
        .then(res => {
          if (res.data.Code == 200 && res.data.Data) {
            let deviceId = res.data.Data
            localStorage.setItem('deviceSerialNo', deviceId)
            this.deviceSerialNo = deviceId
            this.getParkInfo(deviceId)
            this.bindShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    setPay() {
      this.$router.push({ path: '/home/rate', query: { deviceSerialNo: this.deviceSerialNo } })
    },
    // 绑定代理商
    bindAgent() {
      let agentId = localStorage.getItem('agentId-A')
      this.$dialog
        .confirm({
          title: '绑定代理商',
          message: '将绑定到当前账号',
          confirmButtonText: '确认绑定'
        })
        .then(() => {
          // on confirm
          this.agentId = agentId
          this.$refs.parkSubmit.submit()
        })
        .catch(() => {
          // on cancel
        })
    },
    //定位成功回调
    getLoctionSuccess(datas, AddressComponent, marker) {
      let {
        addressComponent: { province, city, street },
        point: { lng, lat }
      } = datas
      this.coordinateLng = lng
      this.coordinateLat = lat
      this.address = `${city}${street}`
    },
    selectLng(value) {
      console.log(value)
      let { coordinateLng, coordinateLat, address } = value
      this.coordinateLng = coordinateLng
      this.coordinateLat = coordinateLat
      this.address = address
      this.Popup = false
    },
    showPopup() {
      this.Popup = true
    },
    onOversize(file) {
      console.log(file)
      this.$toast('文件大小不能超过 1024kb')
    },
    toNext() {
      this.$router.push({ path: '/home/parkAuth' })
    }
  }
}
</script>

<style scoped lang="scss">
html {
  touch-action: none;

  touch-action: pan-y;
}
.parkMes {
  // padding-top: 15%;
  .login {
    color: #1989fa;
    margin-right: 0.1rem;
  }
  .help {
    font-size: 0.6rem;
    color: #1989fa;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 120px;
    height: 120px;
  }
  .BindDevice {
    margin-top: 20px;
  }
  .selectArea {
    display: flex;
    .left {
      flex: none;
      box-sizing: border-box;
      width: 6.5em;
      color: #646566;
      text-align: left;
      word-wrap: break-word;
    }
    .right {
      width: 75%;
    }
  }
}
</style>
