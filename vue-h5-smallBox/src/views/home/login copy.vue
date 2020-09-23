<template>
  <div class="login">
    <van-nav-bar title="登录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <van-field
        type="tel"
        v-model="phone"
        name="phone"
        label="用户名"
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
  </div>
</template>

<script>
// 请求接口
import { login } from '@/api/home.js'
// import { encryptDes, decryptDes } from '@/utils/des' // 引用路径根据自己的文件结构而定
// import { encryptDes, decryptDes } from '@/utils/desCBC' // 引用路径根据自己的文件结构而定
import { encryptDes, decryptDes } from '@/utils/desCBC' // 引用路径根据自己的文件结构而定

export default {
  data() {
    return {
      phone: '',
      password: '',
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      this.$toast({
        message: '加载中...',
        forbidClick: true
      })

      const params = {
        password: values.password,
        phone: values.phone
      }
      login(params)
        .then(res => {
          this.$toast('登陆成功')
          if (res.code == 200 && res.data) {
            let { accessToken, agentId, phone } = res.data
            localStorage.setItem('accessToken-A', accessToken)
            localStorage.setItem('agentId-A', agentId)
            localStorage.setItem('phone-A', phone)
            this.$router.push({ path: '/home/parkMes', query: { ruleForm: this.ruleForm } })
          } else {
            this.$toast(res.msg)
          }
        })
        .catch(res => {
          this.$toast('登录失败')
        })
    },
    login() {
      // this.$router.push({ path: '/home/list', query: { ruleForm: this.ruleForm } })
      console.log(encryptDes('123456test', ''))
      console.log(decryptDes('9e8ab1270381c747', ''))
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  // padding-top: 45%;
}
</style>
