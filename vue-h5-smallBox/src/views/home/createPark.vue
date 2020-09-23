<template>
  <div class="createPark">
    <!-- <van-nav-bar title="车道编辑" left-text="返回" left-arrow @click-left="onClickLeft" /> -->
    <van-form @submit="onSubmit">
      <van-field
        readonly
        v-model="deviceSerialNo"
        name="deviceSerialNo"
        label="设备序列号"
        placeholder="请输入设备序列号"
      />
      <van-field
        v-model="gatewayName"
        name="gatewayName"
        label="车道名称"
        placeholder="车道名称"
        :rules="[{ required: true, message: '请填写车道名称' }]"
      />
      <van-field name="gatewayType" label="出入口类型">
        <template #input>
          <van-radio-group v-model="gatewayType" direction="horizontal">
            <van-radio name="0">入口</van-radio>
            <van-radio name="1">出口</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field name="checkboxGroup" label="授权类型">
        <template #input>
          <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
            <van-checkbox name="1" shape="square">访客车</van-checkbox>
            <van-checkbox name="2" shape="square">临时车</van-checkbox>
            <van-checkbox name="3" shape="square">储值车</van-checkbox>
            <van-checkbox name="4" shape="square">VIP</van-checkbox>
            <van-checkbox name="5" shape="square">预约车</van-checkbox>
            <van-checkbox name="6" shape="square">黑名单</van-checkbox>
            <van-checkbox name="7" shape="square">月租车</van-checkbox>
            <van-checkbox name="8" shape="square">内部车</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <!-- <van-field name="uploader" label="相机类型">
        <template #input>
          <van-uploader v-model="uploader" />
          <van-icon class="help" name="question-o" @click="askQuestion" />
        </template>
      </van-field>-->
      <!--  :rules="[{ pattern:/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,required: true, message: '请填写相机ip地址' }]" -->
      <van-field
        v-model="cameraIP"
        name="cameraIP"
        label="主相机ip"
        placeholder="例如：127.0.0.0"
        :rules="[
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            required: true,
            message: '请按照格式填写'
          }
        ]"
      />
      <van-field v-model="subCameraIP" name="subCameraIP" label="辅相机ip" placeholder="例如：127.0.0.0" />
      <!-- <van-field
        readonly
        clickable
        label="相机类型"
        :value="value1"
        placeholder="选择相机类型"
        @click="showPicker1 = true"
      />
      <van-popup v-model="showPicker1" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns1"
          @cancel="showPicker1 = false"
          @confirm="onConfirm1"
        />
      </van-popup>-->
      <van-field
        readonly
        clickable
        label="LED类型"
        :value="value2"
        placeholder="选择LED类型"
        @click="showPicker2 = true"
      />
      <van-popup v-model="showPicker2" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns2"
          @cancel="showPicker2 = false"
          @confirm="onConfirm2"
        />
      </van-popup>
      <van-field name="ledControlType" label="LED控制卡类型">
        <template #input>
          <van-radio-group v-model="ledControlType" direction="horizontal">
            <van-radio name="0">小蓝卡</van-radio>
            <van-radio name="1">小黄卡</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="remarks" name="remarks" label="备注" placeholder="备注" />
      <div style="margin: 16px">
        <van-button size="small" round block type="info" native-type="submit">{{ buttonType }}</van-button>
      </div>
    </van-form>
    <van-popup v-model="ask">
      <div class="askQues">一般的监控摄像机后面或者下面都是有标签的！你可以通过标签来鉴别摄像机的型号，参数。线数一般是不会标在标签上的，所以你就要去问供货商或者厂家！</div>
    </van-popup>
  </div>
</template>

<script>
import { createGatewayInfo, getGatewayInfo, getDeviceTypeList } from '@/api/home.js'
export default {
  data() {
    return {
      img: require('../../../public/type1.png'),
      buttonType: '新增',
      opType: 'ADD',
      uploader: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }],
      index: '',

      gatewayList: '', // 			车道列表
      deviceSerialNo: '', // 	String	是	设备序列号
      gatewayName: '', // 	String	是	车道名称
      gatewayType: '0', // 	String	是	出入口类型（0入口；1出口）
      ledControlType: '0', // 	String	是	led控制卡类型（0小蓝卡；1小黄卡）
      grantType: '', // 	String	是	授权类型，可多选// 访客车,2.临时车,3.储值车,4.VIP,// 5.预约车，6.黑名单,7.月租车，8.内部车）
      cameraIP: '', // 	String	是	相机IP
      cameraPort: '', // 	String	是	端口
      subCameraIP: '', // 	String	是	相机IP
      subCameraPort: '', // 	String	是	端口
      cameraType: '0', //String	相机类型（参考设备类型接口）默认传0
      ledType: '0', // 	String	LED类型（参考设备类型接口）
      remarks: '', // 	String	是	备注
      gatewayId: '', // 	String	是	修改删除必传值

      value1: '',
      showPicker1: false,
      value2: '四行屏',
      showPicker2: false,
      checkbox: false,
      checkboxGroup: ['1', '2', '3', '4', '5', '6', '7', '8'],

      gatewayNameList: [],
      columns1: [{ text: '暂无数据', value: '0' }],
      columns2: [{ text: '暂无数据', value: '1' }],

      ask: false
    }
  },
  mounted() {
    this.getCameraList()
    this.getLedList()
    let deviceId = this.$route.query.deviceSerialNo
    this.index = this.$route.query.index
    if (deviceId) {
      this.deviceSerialNo = deviceId
      this.opType = 'EDIT'
      this.buttonType = '修改'
      this.getGatewayInfo(deviceId)
    } else {
      this.deviceSerialNo = localStorage.getItem('deviceSerialNo')
      this.getGatewayInfo(this.deviceSerialNo)
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      this.createGatewayInfo(values)
    },
    initGateInfo(data) {
      let {
        deviceSerialNo,
        gatewayList,
        gatewayName,
        gatewayType,
        ledControlType,
        grantType,
        cameraIP,
        cameraPort,
        subCameraIP,
        subCameraPort,
        cameraType,
        ledType,
        remarks,
        gatewayId
      } = data.gatewayList[Number(this.index)]
      data.gatewayList.forEach(element => {
        this.gatewayNameList.push(element.gatewayName)
      })
      this.gatewayId = gatewayId //8 	String	是	车道id 修改 删除必传

      this.deviceSerialNo = deviceSerialNo // 1	String	是	设备序列号
      this.gatewayList = gatewayList // 	2		车道列表
      this.gatewayName = gatewayName // 3	String	是	车道名称
      this.gatewayType = gatewayType //4 	String	是	出入口类型（0入口；1出口）
      this.ledControlType = ledControlType //4 	String	是	led控制卡；类型（0小蓝卡；1小黄卡）
      this.checkboxGroup = grantType.split(',') // 5	String	是	授权类型，可多选// 1.访客车,2.临时车,3.储值车,4.VIP,// 5.预约车，6.黑名单,7.月租车，8.内部车）
      this.cameraIP = cameraIP // 6	String	是	相机IP
      this.cameraPort = cameraPort // 7	String	是	端口
      this.subCameraIP = subCameraIP // 6	String	是	相机IP
      this.subCameraPort = subCameraPort // 7	String	是	端口
      this.remarks = remarks //8 	String	是	备注
      // this.cameraType //String	是	相机类型（参考设备类型接口）
      // this.ledType // 	String	是	LED类型（参考设备类型接口）
      this.getCameraList(cameraType)
      this.getLedList(ledType)
      this.$refs.cameras.swipeTo(cameraType)
      this.$refs.ledras.swipeTo(ledType)
    },
    getGatewayInfo(deviceId) {
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getGatewayInfo(reqParams)
        .then(res => {
          if (res.data) {
            // 回显车场信息
            this.initGateInfo(res.data)
          }
        })
        .catch(res => {})
    },
    createGatewayInfo(values) {
      let {
        deviceSerialNo,
        checkboxGroup,
        gatewayList,
        gatewayName,
        gatewayType,
        ledControlType,
        cameraIP,
        cameraPort,
        subCameraIP,
        subCameraPort,
        cameraType,
        ledType,
        remarks
      } = values
      // 判断添加时是否有重名车场
      if (this.gatewayNameList.indexOf(gatewayName) == 0 && this.opType == 'ADD') {
        this.$toast('车场名称已存在')
        return
      }
      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 1	String	是	设备序列号
        opType: this.opType, // 1	String	是	操作类型
        gatewayId: this.gatewayId, //	String	否	车道ID（修改或删除时必传）
        gatewayList: gatewayList, // 	2		车道列表
        gatewayName: gatewayName, // 3	String	是	车道名称
        gatewayType: gatewayType, //4 	String	是	出入口类型（0入口；1出口）
        ledControlType: ledControlType, //4 	String	是	led控制卡；类型（0小蓝卡；1小黄卡）
        grantType: checkboxGroup.toString(), // 5	String	是	授权类型，可多选// 1.访客车,2.临时车,3.储值车,4.VIP,// 5.预约车，6.黑名单,7.月租车，8.内部车）
        cameraIP: cameraIP, // 6	String	是	主相机IP
        cameraPort: cameraPort, // 7	String	是	主端口
        subCameraIP: subCameraIP, // 	String	是	辅相机IP
        subCameraPort: subCameraPort, // 	String	是	辅端口
        cameraType: this.cameraType, //String	相机类型（参考设备类型接口）
        ledType: this.ledType, // 	String	LED类型（参考设备类型接口）
        remarks: remarks //8 	String	是	备注
      }
      if (this.opType == 'EDIT') {
        reqParams.gatewayId = this.gatewayId
      }
      createGatewayInfo(reqParams)
        .then(res => {
          if (res.code == 200) {
            this.opType == 'ADD' ? this.$toast('创建成功') : this.$toast('修改成功')
            this.getGatewayInfo(this.deviceSerialNo)
            this.$router.push({ path: '/home/parkAuth' })
          } else {
            this.opType == 'ADD' ? this.$toast('创建失败') : this.$toast('修改失败')
          }
        })
        .catch(res => {
          this.opType == 'ADD' ? this.$toast('创建失败') : this.$toast('修改失败')
        })
    },
    askQuestion() {
      this.ask = true
    },
    onConfirm1(value) {
      this.value1 = value.text
      this.cameraType = value.value
      this.showPicker1 = false
    },
    onConfirm2(value) {
      this.value2 = value.text
      this.ledType = value.value
      this.showPicker2 = false
    },
    // 获取相机类型列表
    getCameraList(value) {
      let reqParams = {
        deviceType: 'sys_camera_type'
      }
      getDeviceTypeList(reqParams)
        .then(res => {
          let array = []
          res.data.forEach(element => {
            array.push({
              text: element.deviceName,
              value: element.deviceId
            })
            if (value && value == element.deviceId) {
              this.value1 = element.deviceName
              this.cameraType = element.deviceId
            }
          })
          this.columns1 = array
        })
        .catch()
    },
    // 获取相机类型列表
    getLedList(value) {
      let reqParams = {
        deviceType: 'sys_led_type'
      }
      getDeviceTypeList(reqParams)
        .then(res => {
          let array = []
          res.data.forEach(element => {
            array.push({
              text: element.deviceName,
              value: element.deviceId
            })
            if (value && value == element.deviceId) {
              this.value2 = element.deviceName
              this.ledType = element.deviceId
            }
          })
          this.columns2 = array
        })
        .catch()
    },
    changeCametype(index) {
      console.log('11')
      console.log(index)
      this.cameraType = index.toString()
    },
    changeLEDtype(index) {
      console.log('11')
      console.log(index)
      this.ledType = index.toString()
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.van-checkbox--horizontal {
    margin-right: 0.32rem;
    margin-bottom: 0.1rem;
}
.createPark {
  .help {
    font-size: 32px;
  }
  .askQues {
    font-size: 24px;
  }
  .cancel {
    color: #1989fa;
    margin-right: 0.1rem;
  }
  .cametype {
    // display: flex;
    // justify-content: space-between;
    .my-swipe .van-swipe-item {
      // color: #fff;
      // font-size: 20px;
      // line-height: 150px;
      // text-align: center;
      // background-color: #39a9ed;
      .label {
        position: absolute;
        left: 0;
        top: 1rem;
        display: inline-block;
        height: 100%;
        line-height: 100%;
        // font-size: 0.4rem;
        margin-left: 16px;
        margin-right: 16px;
      }
      .place {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: 100%;
        // font-size: 0.4rem;
        margin-left: 16px;
        margin-right: 16px;
      }
      .image {
        height: 2rem;
      }
    }
  }
}
</style>
