<template>

  <div class="home">
    <van-image src="https://leting360-prod.oss-cn-hangzhou.aliyuncs.com/logo/logo_leting.png" />
    <van-grid clickable :column-num="3">
      <van-grid-item
        @click="clickGrid(item.path,item.name)"
        :border="true"
        v-for="(item, index) in LinkArrayFuc"
        :key="index"
        :icon="item.icon"
        :text="item.name"
      />
      <!-- <van-grid-item icon="search" text="URL 跳转" url="/vant/mobile.html" /> -->
    </van-grid>
    <van-dialog class="dialog" v-model="show" title="资料" :show-cancel-button="false" theme="round">
      <div class="content" v-if="userNameA">用户名：{{userNameA}}</div>
      <div class="content">当前账号：{{phoneA || phoneM}}</div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      LinkArray: [
        {
          path: null,
          icon: 'manager-o',
          name: '管理员'
        },
        {
          path: '/home/login',
          icon: 'manager-o',
          name: '登录'
        },
        // {
        //   path: '/home/bind',
        //   icon: 'bag-o',
        //   name: '绑定设备'
        // },
        {
          path: '/home/agentList',
          icon: 'orders-o',
          name: '代理商列表'
        },
        {
          path: '/home/parkMes',
          icon: 'apps-o',
          name: '车场信息'
        },
        {
          path: '/home/parkAuth',
          icon: 'logistics',
          name: '车道权限'
        },

        {
          path: '/home/rate',
          icon: 'setting-o',
          name: '银行卡'
        },
        {
          path: '/home/bilRules',
          icon: 'gold-coin-o',
          name: '计费'
        },
        {
          path: '/home/invoice',
          icon: 'balance-list-o',
          name: '发票'
        },
        {
          path: '/home/password',
          icon: 'bag-o',
          name: '修改密码'
        },
        {
          path: '/home/login',
          icon: 'bag-o',
          name: '退出登录'
        }
      ],
      accessTokenA: '',
      accessTokenM: '',
      phoneA: '',
      userNameA: '',
      phoneM: '',
      title: '管理员',

      show: false
    }
  },

  //利用vue的计算属性，过滤掉不需要的数据，剩下需要的数据再利用v-for循环遍历取出渲染
  computed: {
    LinkArrayFuc() {
      let that = this
      return that.LinkArray.filter(function (item) {
        if ((item.name == '登录' && that.accessTokenA) || (item.name == '登录' && that.accessTokenM)) {
          // 只要有登录信息就隐藏掉
          return
        }
        // if ((item.name == '管理员' && !that.accessTokenA) || (item.name == '管理员' && !that.accessTokenM)) {
        //   // 只要没有登录信息就隐藏掉
        //   return
        // }
        if (item.name == '绑定设备' && !that.accessTokenA) {
          // 只要代理商没有登录，那就没有绑定设备
          return
        }
        if (item.name == '修改密码' && !that.accessTokenA) {
          // 只要代理商没有登录，那就没有修改密码
          return
        }
        if (item.name == '代理商列表' && !that.accessTokenA) {
          // 只要代理商没有登录，那就没有代理商列表
          return
        }
        return item.name
      })
    }
  },

  mounted() {
    this.phoneA = localStorage.getItem('phone-A')
    this.userNameA = localStorage.getItem('userName-A')
    this.phoneM = localStorage.getItem('phone-M')
    this.accessTokenA = localStorage.getItem('accessToken-A')
    this.accessTokenM = localStorage.getItem('accessToken-M')
    if (this.accessTokenA) {
      this.LinkArray[0].name = '代理商'
    }
  },
  methods: {
    toLink() {
      this.$router.push({ path: '/home/login', query: { ruleForm: this.ruleForm } })
    },
    clickGrid(path, name) {
      if (name == '退出登录') {
        this.$dialog
          .confirm({
            title: '退出登录吗？',
            // message: '将绑定到当前账号',
            confirmButtonText: '确认退出'
          })
          .then(() => {
            localStorage.clear()
            this.$router.push({ path: path })
          })
          .catch(() => {
            // on cancel
          })
      } else if (!path) {
        this.show = true
      } else {
        this.$router.push({ path: path })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  color: #1989fa;
  .dialog {
    color: #323233;
    .content {
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
