<template>
  <div class="title">
    <div class="steps">
      <!-- :active-icon="icon" -->
      <van-steps :active="active" active-color="#38f">
        <van-step v-for="(item, index) in stepList" :key="index">{{ item.title }}</van-step>
      </van-steps>
    </div>
    <div class="nextSet">
      <van-button size="mini" native-type="button" type="info" @click="preStep(prePath)">上一步</van-button>
      <!-- <van-nav-bar style="max-width: 100%" :title="title"> </van-nav-bar> -->
      <van-button size="mini" native-type="button" type="info" @click="nextStep(nextPath)">下一步</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prePath: {
      type: String,
      default: ''
    },
    nextPath: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: 0
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      stepList: [
        {
          title: '车场信息',
          to: {
            name: 'ParkMes'
          },
          icon: 'apps-o'
        },
        {
          title: '车道配置',
          to: {
            name: 'ParkAuth'
          },
          icon: 'logistics'
        },
        {
          title: '银行卡',
          to: {
            name: 'Rate'
          },
          icon: 'setting-o'
        },
        // {
        //   title: '车场信息',
        //   to: {
        //     name: 'ParkMes'
        //   },
        //   icon: 'apps-o'
        // },

        // {
        //   title: '登录',
        //   to: {
        //     name: 'Login'
        //   },
        //   icon: 'manager-o'
        // },
        {
          title: '计费',
          to: {
            name: 'BilRules'
          },
          icon: 'gold-coin-o'
        },
        {
          title: '发票',
          to: {
            name: 'Invoice'
          },
          icon: 'balance-list-o'
        },
        {
          title: '完成',
          to: {
            name: 'Index'
          },
          icon: 'home-o'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    preStep(path) {
      console.log(path)
      this.$router.push({ path: path, query: { deviceSerialNo: this.deviceSerialNo } })
    },
    nextStep(path) {
      this.$router.push({ path: path, query: { deviceSerialNo: this.deviceSerialNo } })
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  margin-top: -0.75rem;
  .steps {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .nextSet {
    display: flex;
    justify-content: space-between;
    /deep/ .van-nav-bar__title {
      max-width: 100%;
    }
  }
}
</style>
