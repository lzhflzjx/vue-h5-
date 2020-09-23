<template>
  <!-- success-text="刷新成功" -->
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="app-container">
      <div class="layout-content">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view></router-view>
        </keep-alive>
        <router-view v-else></router-view>
      </div>
      <!-- <div  class="layout-footer">
        <TabBar :data="tabbars" @change="handleChange" />
      </div> -->
      <!--  class="step" -->
      <!-- <Step :data="tabbars" :active="active"></Step> -->
    </div>
  </van-pull-refresh>
</template>

<script>
import TabBar from '@/components/TabBar'
import Step from '@/components/Step'
export default {
  name: 'AppLayout',
  components: {
    TabBar,
    Step
  },
  mounte () {
    this.$route.query
    console.log("this.$route.query")
    console.log(this.$route.query)
    // this.active = v
  },
  data() {
    return {
      tabbars: [
        {
          title: '首页',
          to: {
            name: 'Index'
          },
          icon: 'home-o'
        },
        {
          title: '车场信息',
          to: {
            name: 'ParkMes'
          },
          icon: 'apps-o'
        },
        {
          title: '银行卡',
          to: {
            name: 'Rate'
          },
          icon: 'setting-o'
        },
        {
          title: '车道配置',
          to: {
            name: 'ParkAuth'
          },
          icon: 'logistics'
        },
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
          title: '地图',
          to: {
            name: 'Map'
          },
          icon: 'balance-list-o'
        },
      ],
      isLoading: false, //下拉刷新
      active: 0
    }
  },
  methods: {
    handleChange(v) {
      console.log('tab value:', v)
    },
    onRefresh() {
      location.reload()
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.step {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
