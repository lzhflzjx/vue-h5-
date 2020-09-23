<template>
  <div class="login">
    <!-- <van-nav-bar title="登录" left-text="返回" left-arrow @click-left="onClickLeft" /> -->
    <van-tabs v-model="activeName">
      <van-tab title="管理员" name="1">
        <van-form @submit="onSubmitM">
          <van-field
            type="tel"
            v-model="phoneManager"
            name="phoneManager"
            label="手机号"
            placeholder="请填写手机号"
            :rules="[{ pattern: /^1[3456789]\d{9}$/, required: true, message: '请输入正确手机号' }]"
          />
          <van-field
            type="tel"
            v-model="code"
            name="code"
            maxlength="4"
            center
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
            :rules="[{ required: true, message: '请输入正确验证码' }]"
          >
            <template #button>
              <van-button
                :disabled="disabled"
                size="small"
                native-type="button"
                type="primary"
                @click="sendCode"
              >
                <span v-show="!sendFlag">发送验证码</span>
                <span v-show="sendFlag" style="color:#fff">
                  <van-count-down
                    ref="countDown"
                    millisecond
                    :time="60000"
                    :auto-start="false"
                    format="ss"
                    @finish="finish"
                  />秒后重新发送
                </span>
              </van-button>
            </template>
          </van-field>
          <!-- <van-grid clickable>
            <van-grid-item text="开始" icon="play-circle-o" @click="start" />
            <van-grid-item text="暂停" icon="pause-circle-o" @click="pause" />
            <van-grid-item text="重置" icon="replay" @click="reset" />
          </van-grid>-->
          <div style="margin: 16px">
            <!-- @click="login" -->
            <van-button round block type="info" native-type="submit">登录</van-button>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="代理商" name="2">
        <van-form @submit="onSubmit">
          <van-field
            type="tel"
            v-model="phone"
            name="phone"
            label="手机号"
            placeholder="请填写手机号"
            :rules="[{ pattern: /^1[3456789]\d{9}$/, required: true, message: '请输入正确手机号' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px">
            <!-- @click="login" -->
            <van-button round block type="info" native-type="submit">登录</van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 请求接口
import { login, smsLogin, sendSms, getParkInfo } from '@/api/home.js'
// import { encryptDes, decryptDes } from '@/utils/des' // 引用路径根据自己的文件结构而定
// import { encryptDes, decryptDes } from '@/utils/desCBC' // 引用路径根据自己的文件结构而定
import { encryptDes, decryptDes } from '@/utils/desCBC' // 引用路径根据自己的文件结构而定
export default {
  data() {
    return {
      deviceSerialNo: '',
      phone: '',
      password: '',
      activeName: '1',

      phoneManager: '',
      code: '',
      sendFlag: false,
      disabled: false
    }
  },
  mounted() {
    // 1108d79dc831f5f3ac9234 测试号
    let deviceId = this.$route.query.deviceSerialNo || ''
    this.deviceSerialNo = deviceId
    this.deviceIdEncoding(deviceId)
  },
  methods: {
    // 转码设备id
    // http://parktest.leting360.cn/GetTollUniqueEncoding?ArmUniqueID=1108d79dc831f5f3ac1234
    deviceIdEncoding(deviceId) {
      this.$axios
        .get(`https://parktest.leting360.cn/GetTollUniqueEncoding?ArmUniqueID=${deviceId}`)
        .then(res => {
          // 转码成功才进入
          if (res.data.Code == 200 && res.data.Data) {
            let deviceId = res.data.Data
            localStorage.setItem('deviceSerialNo', deviceId)
            // 有token跳过登录
            let accessTokenM = localStorage.getItem('accessToken-M')
            let accessTokenA = localStorage.getItem('accessToken-A')
            if (accessTokenM || accessTokenA) {
              this.getParkInfo(deviceId)
            }
          } else {
            this.$toast('设备解码失败，请重新扫码')
            console.log('退出浏览器')
          }
        })
        .catch(err => {
          this.$toast('设备解码失败，请重新扫码')
        })
    },
    // 退出浏览器
    outbrowser() {
      setTimeout(() => {
        let userAgent = navigator.userAgent
        if (userAgent.indexOf('Firefox') != -1 || userAgent.indexOf('Chrome') != -1) {
          window.open('', '_self').close()
          window.location.href = 'about:blank'
        } else {
          window.opener = null
          window.open('about:blank', '_self')
          window.close()
        }
      }, 1500)
    },
    onSubmit(values) {
      console.log('submit', values)
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      this.login(values)
    },
    login(values) {
      const params = {
        password: values.password,
        phone: values.phone
      }
      login(params)
        .then(res => {
          this.$toast('登陆成功')
          if (res.code == 200 && res.data) {
            let { accessToken, agentId, phone, userName } = res.data
            //             accessToken: "A41BB9FA6E86B689108278C53A768B67"
            // agentId: "AXWY001"
            // agentName: "代理商测试"
            // expiresTime: "2020-10-17 11:13:03"
            // loginTime: "2020-09-17 11:13:03"
            // phone: "15313189739"
            // userName: "测试员9"
            localStorage.setItem('accessToken-A', accessToken)
            localStorage.setItem('agentId-A', agentId)
            localStorage.setItem('phone-A', phone)
            localStorage.setItem('userName-A', userName)
            this.$router.push({ path: '/home/index' })
          } else {
            this.$toast(res.msg)
          }
        })
        .catch(res => {
          this.$toast(res.msg || '登录失败')
        })
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    // 管理员登录
    onSubmitM(values) {
      console.log('submit', values)
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      this.smsLogin(values)
    },
    smsLogin(values) {
      // 没有有token进入登录
      const params = {
        phone: values.phoneManager,
        code: values.code
      }
      smsLogin(params)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$toast('登陆成功')
            let { accessToken } = res.data
            localStorage.setItem('accessToken-M', accessToken)
            localStorage.setItem('phone-M', this.phoneManager)
            this.getParkInfo(this.deviceSerialNo)
          } else {
            this.$toast(res.msg)
          }
        })
        .catch(err => {
          this.$toast(err.msg || '登录失败')
        })
    },
    // 获取车场信息接口
    getParkInfo(deviceId) {
      console.log('deviceId')
      console.log(deviceId)
      let reqParams = {
        deviceSerialNo: deviceId //设备序列号
      }
      getParkInfo(reqParams)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$router.push({ path: '/home/index', query: { ruleForm: this.ruleForm } })
          } else {
            this.$router.push({ path: '/home/parkMes', query: { ruleForm: this.ruleForm } })
          }
        })
        .catch(res => {
          this.$router.push({ path: '/home/parkMes', query: { ruleForm: this.ruleForm } })
        })
    },
    sendCode() {
      let phone = this.phoneManager
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        this.$toast('请先输入正确的手机号')
        return
      }
      let reqParams = {
        phone: phone
      }
      this.start()
      sendSms(reqParams)
        .then(res => {
          if (res.code == 200) {
          } else {
            this.$toast('获取验证码失败，请稍后重新获取')
          }
        })
        .catch(res => {
          this.$toast('获取验证码失败，请重新获取')
        })
    },
    start() {
      this.sendFlag = true
      this.disabled = true
      this.$refs.countDown.start()
    },
    reset() {
      this.sendFlag = false
      this.disabled = false
      this.$refs.countDown.reset()
    },
    finish() {
      this.sendFlag = false
      this.disabled = false
      this.$refs.countDown.reset()
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  // padding-top: 45%;
}
/deep/.van-count-down {
  display: inline-block;
  color: #fff;
  font-size: 0.37333rem;
  line-height: 0.53333rem;
}
/deep/.van-button--primary {
  color: #fff;
  background-color: #1989fa;
  border: 0.02667rem solid #1989fa;
}
/deep/.van-tabs__line {
  background-color: #1989fa;
}
/deep/.van-tab__pane,
.van-tab__pane-wrapper {
  margin-top: 1rem;
}
</style>
