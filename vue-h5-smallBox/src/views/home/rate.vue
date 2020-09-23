<template>
  <div class="rate">
    <van-form @submit="onSubmit2">
      <van-field
        v-model="deviceSerialNo"
        name="deviceSerialNo"
        label="设备序列号"
        placeholder="设备序列号"
        :rules="[{ required: true, message: '请填写设备序列号' }]"
      />
      <van-field
        v-model="account"
        name="account"
        label="银行卡号"
        placeholder="银行卡号"
        :rules="[{ pattern: /^[1-9]\d{9,29}$/, required: true, message: '卡号不合法，仅支持建行' }]"
      />
      <van-field
        readonly
        clickable
        label="账号类型"
        :value="value"
        placeholder="选择账号类型"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <van-field
        v-model="bankName"
        name="bankName"
        label="开户银行"
        placeholder="开户银行"
        :rules="[{ required: true, message: '请填写开户银行' }]"
      />
      <div class="submition">
        <van-button  size="small" block type="info" native-type="submit">提交</van-button>
        <Title class="step" :prePath="prePath" :nextPath="nextPath" :active="active" :title="title"></Title>
      </div>
      <div></div>
      <div class="direction">银行支付仅支持建行，聚合支付支持微信支付宝付款</div>
    </van-form>
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
      bankName: '建设银行', // 	String	是	开户银行
      account: '', // 	String	是	账号
      accountType: '01', // 	String	是	账号类型
      contactPerson: '', // 	String	是	联系人姓名
      contactPhoneNum: '', // 	String	是	联系人电话号码
      serverFee: '', // 	String	是	服务费
      taxPoint: '0.004', // 	String	是	费率
      remarks2: '', // 	String	否	备注信息
      userName: '', // 	String	是	操作人员（登录手机账号）
      value: '本行对公',
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
      this.getCcbAccountInfo(deviceId)
    } else {
    }

    let type = sessionStorage.getItem('payType')
    if (type) {
      this.activeName = type // 取出支付类型
    }
  },
  methods: {
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
          this.$router.push({ path: '/home/bilRules' })
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
  font-size: 24px;
  padding: 16px;
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
