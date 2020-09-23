<template>
  <div class="rate">
    <van-tabs v-model="activeName">
      <van-tab title="建行聚合" name="2">
        <van-form @submit="onSubmit2">
          <van-field
            v-model="account"
            name="account"
            label="银行卡号"
            placeholder="银行卡号"
            :rules="[{ pattern: /^[1-9]\d{9,29}$/, required: true, message: '卡号不合法' }]"
          />
          <van-field
            readonly
            clickable
            label="账号类型"
            :value="value"
            placeholder="选择账号类型"
            @click="showPicker = true"
          />
          <van-field
            v-model="deviceSerialNo"
            name="deviceSerialNo"
            label="设备序列号"
            placeholder="设备序列号"
            :rules="[{ required: true, message: '请填写设备序列号' }]"
          />
          <van-field
            v-model="bankName"
            name="bankName"
            label="开户银行"
            placeholder="开户银行"
            :rules="[{ required: true, message: '请填写开户银行' }]"
          />
          <van-field
            v-model="contactPerson"
            name="contactPerson"
            label="联系人姓名"
            placeholder="姓名"
            :rules="[{ required: true, message: '请填写姓名' }]"
          />
          <van-field
            type="tel"
            v-model="contactPhoneNum"
            name="contactPhoneNum"
            label="联系人电话"
            placeholder="请填写手机号"
            :rules="[{ pattern: /^1[3456789]\d{9}$/, required: true, message: '请输入正确手机号' }]"
          />
          <van-field
            v-model="serverFee"
            name="serverFee"
            label="服务费"
            placeholder="服务费"
            :rules="[{ required: true, message: '请填写服务费' }]"
          />
          <van-field
            readonly
            v-model="taxPoint"
            name="taxPoint"
            label="费率"
            placeholder="费率"
            :rules="[{ required: true, message: '请填写费率' }]"
          />
          <van-popup v-model="showPicker" round position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @cancel="showPicker = false"
              @confirm="onConfirm"
            />
          </van-popup>
          <van-field v-model="remarks2" name="remarks2" label="备注" placeholder="备注" />
          <div class="submition">
            <van-button round block type="info" native-type="submit">提交</van-button>
            <Title
              class="step"
              :prePath="prePath"
              :nextPath="nextPath"
              :active="active"
              :title="title"
            ></Title>
          </div>
          <div></div>
          <div class="direction">聚合支付支持微信支付宝付款</div>
        </van-form>
      </van-tab>
      <van-tab title="微信支付宝" name="1">
        <van-form v-if="!hasApply" @submit="onSubmit1">
          <van-divider>所需账户</van-divider>
          <van-cell value="1.支付宝商家号" />
          <van-cell value="2.微信商户号" />
          <van-cell value="3.微信公众号" />
          <van-checkbox v-model="checked">我已确认以上三项已经全部开通</van-checkbox>
          <span v-if="checked">
            <van-field
              v-model="deviceSerialNo"
              name="deviceSerialNo"
              label="设备序列号"
              placeholder="设备序列号"
              :rules="[{ required: true, message: '请填写设备序列号' }]"
            />
            <van-field
              v-model="contactPerson1"
              name="contactPerson1"
              label="申请人姓名"
              placeholder="请输入申请人姓名"
              :rules="[{required: true, message: '申请人姓名' }]"
            />
            <van-field
              type="tel"
              v-model="contactPhoneNum1"
              name="contactPhoneNum1"
              label="申请人电话"
              placeholder="申请人姓名手机号码"
              :rules="[
              { pattern: /^1[3456789]\d{9}$/, required: true, message: '手机号格式不正确' }
            ]"
            />
            <van-field v-model="remarks1" name="remarks1" label="备注" placeholder="备注" />
            <div style="margin: 16px">
              <van-button :disabled="!checked" round block type="info" native-type="submit">申请</van-button>
            </div>
          </span>

          <div class="direction">费率说明:微信和支付宝支付服务手续费为0.006</div>
        </van-form>
        <div v-else>
          <div style="margin: 16px">
            <van-button @click="retryApply" round block type="info">重新申请</van-button>
          </div>
          <div class="applySucc">申请成功后需要1-3个工作日回复</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { createPayInfo, getPayInfo, createCcbAccountInfo, getCcbAccountInfo } from '@/api/home.js'
import Title from './components/title'
export default {
  components: {
    Title
  },
  data() {
    return {
      activeName: '1',

      deviceSerialNo: '', // 	String	是	设备序列号
      contactPhoneNum1: '', // 	String	是	申请人电话
      contactPerson1: '', // 	String	是	申请人姓名
      remarks1: '', // 	String	是	备注

      bankName: '建设银行', // 	String	是	开户银行
      account: '', // 	String	是	账号
      accountType: '', // 	String	是	账号类型
      contactPerson: '', // 	String	是	联系人姓名
      contactPhoneNum: '', // 	String	是	联系人电话号码
      serverFee: '', // 	String	是	服务费
      taxPoint: '0.004', // 	String	是	费率
      remarks2: '', // 	String	否	备注信息
      userName: '', // 	String	是	操作人员（登录手机账号）
      value: '',
      showPicker: false,
      columns: [
        { text: '本行对公', value: '01' },
        { text: '本行对私借记', value: '02' },
        { text: '合约账户', value: '03' },
        { text: '内部帐户', value: '07' }
      ],

      prePath: '/home/parkAuth',
      nextPath: '/home/bilRules',
      title: '支付配置',
      active: '2',

      checked: false,
      hasApply: false
    }
  },
  mounted() {
    let deviceId = localStorage.getItem('deviceSerialNo')
    if (deviceId) {
      this.deviceSerialNo = deviceId
      this.getPayInfo(deviceId)
      this.getCcbAccountInfo(deviceId)
    } else {
    }

    let type = sessionStorage.getItem('payType')
    if (type) {
      this.activeName = type // 取出支付类型
    }
  },
  methods: {
    // 微信支付宝
    onSubmit1(values) {
      console.log('submit', values)
      if (!this.checked) {
        return
      }
      this.createPayInfo(values)
    },
    retryApply() {
      this.hasApply = false
      this.checked = false
    },
    initPayInfo(data) {
      let { deviceSerialNo, contactPerson, contactPhoneNum, remarks } = data
      this.deviceSerialNo = deviceSerialNo // 	String	是	设备序列号
      this.contactPhoneNum1 = contactPhoneNum // 	String	是	申请人电话
      this.contactPerson1 = contactPerson // 	String	是	申请人姓名
      this.remarks1 = remarks // 	String	是	备注
    },
    getPayInfo(deviceId) {
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getPayInfo(reqParams)
        .then(res => {
          if (res.data && res.code == 200) {
            this.checked = true
            this.hasApply = true
            this.initPayInfo(res.data)
          }
        })
        .catch()
    },
    createPayInfo(values) {
      let { deviceSerialNo, contactPerson1, contactPhoneNum1, remarks1 } = values
      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 	String	是	设备序列号
        contactPhoneNum: contactPhoneNum1, // 	String	是	申请人电话
        contactPerson: contactPerson1, // 	String	是	申请人姓名
        remarks: remarks1 // 	String	是	备注
      }

      createPayInfo(reqParams)
        .then(res => {
          this.$toast('申请成功')
          this.getPayInfo()
        })
        .catch(res => {})
    },

    // 建行
    onSubmit2(values) {
      console.log('submit', values)
      this.createCcbAccountInfo(values)
    },
    initAccountInfo(data) {
      let {
        deviceSerialNo,
        bankName,
        account,
        accountType,
        contactPerson,
        contactPhoneNum,
        serverFee,
        taxPoint,
        remarks,
        userName
      } = data

      this.deviceSerialNo = deviceSerialNo //	String	是	设备序列号
      this.bankName = bankName // 	String	是	开户银行
      this.account = account // 	String	是	银行卡号
      this.contactPerson = contactPerson // 	String	是	联系人姓名
      this.contactPhoneNum = contactPhoneNum // 	String	是	联系人电话号码
      this.serverFee = serverFee // 	String	是	服务费
      // taxPoint = taxPoint// 	String	是	费率
      this.remarks2 = remarks // 	String	否	备注信息
      this.userName = userName // 	String	是	操作人员（登录手机账号）
      this.columns.forEach(element => {
        if (accountType == element.value) {
          this.value = element.text // 	String	是	账号类型id
          this.accountType = element.value // 	String	是	账号类型id
        }
      })
    },
    getCcbAccountInfo(deviceId) {
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getCcbAccountInfo(reqParams)
        .then(res => {
          if (res.data) {
            this.initAccountInfo(res.data)
          }
        })
        .catch()
    },
    createCcbAccountInfo(values) {
      let {
        deviceSerialNo,
        bankName,
        account,
        contactPerson,
        contactPhoneNum,
        serverFee,
        taxPoint,
        remarks2,
        userName
      } = values

      let reqParams = {
        deviceSerialNo: deviceSerialNo, // 	String	是	设备序列号
        bankName: bankName, // 	String	是	开户银行
        account: account, // 	String	是	账号
        accountType: this.accountType, // 	String	是	账号类型
        contactPerson: contactPerson, // 	String	是	联系人姓名
        contactPhoneNum: contactPhoneNum, // 	String	是	联系人电话号码
        serverFee: serverFee, // 	String	是	服务费
        taxPoint: taxPoint, // 	String	是	费率
        remarks: remarks2, // 	String	否	备注信息
        userName: userName // 	String	是	操作人员（登录手机账号）
      }

      createCcbAccountInfo(reqParams)
        .then(res => {
          this.$toast('配置成功')
          this.getCcbAccountInfo(this.deviceSerialNo)
        })
        .catch(res => {})
    },
    onConfirm(value) {
      this.value = value.text
      this.accountType = value.value
      this.showPicker = false
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.van-cell__value--alone {
  text-align: center;
}
/deep/.van-checkbox {
  display: flex;
  justify-content: center;
  /deep/.van-checkbox__label {
    color: #969799;
  }
}
.applySucc {
  color: #969799;
  text-align: center;
}
.direction {
  color: red;
  text-align: center;
}
.submition {
  margin: 16px 0;
}
/deep/.van-button--block {
  display: block;
  width: 50%;
  margin: auto;
}
</style>
