<template>
  <div class="password">
    <!-- <van-nav-bar
      title="修改密码"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    /> -->
    <van-form class="updatePwd" @submit="onSubmit">
      <van-field
        type="tel"
        readonly
        v-model="phone"
        name="phone"
        label="用户名"
        placeholder="请填写手机号"
        :rules="[{ pattern: /^1[3456789]\d{9}$/, required: true, message: '请输入正确手机号' }]"
      />
      <van-field
        v-model="oldPassword"
        type="Password"
        name="oldPassword"
        label="旧密码"
        placeholder="旧密码"
        :rules="[{ required: true, message: '请填写旧密码' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="新密码"
        placeholder="新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <div style="margin: 16px">
        <!-- @click="updatePwd" -->
        <van-button round block type="info" native-type="submit">确认修改</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 请求接口
import { updatePwd } from '@/api/home.js'

export default {
  data() {
    return {
      phone: '',
      oldPassword: '',
      password: '',
      accessToken: ''
    }
  },
  created() {
    this.phone = localStorage.getItem('phone-A') || localStorage.getItem('phone-M') 
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      let accessToken = localStorage.getItem('accessToken-A')
      const params = {
        oldPassword: values.oldPassword,
        password: values.password,
        phone: values.phone,
        accessToken: accessToken
      }
      updatePwd(params)
        .then(res => {
          this.$toast('修改成功')
          if (res.code == 200) {
            this.$router.push({ path: '/home/index', query: { ruleForm: this.ruleForm } })
          } else {
            this.$toast(res.msg)
          }
        })
        .catch(res => {
          this.$toast('修改失败')
        })
    },
    updatePwd() {
      // this.$router.push({ path: '/home/list', query: { ruleForm: this.ruleForm } })
    },
    onClickLeft(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.updatePwd {
  // padding-top: 45%;
}
</style>
