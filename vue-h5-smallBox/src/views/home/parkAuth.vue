<template>
  <div class="parkList">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-swipe-cell v-for="(item, index) in list" :key="index">
        <van-cell
          :border="false"
          :title="item.gatewayName"
          @click="editGateway(item.deviceSerialNo, index)"
          :value="formatValue(item.deviceSerialNo)"
        />
        <template #right>
          <van-button square type="danger" text="删除" @click="remove(item)" />
        </template>
      </van-swipe-cell>
    </van-list>
    <div class="createPark">
      <van-button block size="small" type="info" @click="createGateway">新增车道</van-button>
      <Title class="step" :prePath="prePath" :nextPath="nextPath" :active="active" :title="title"></Title>
    </div>
  </div>
</template>

<script>
import { getGatewayInfo, createGatewayInfo } from '@/api/home.js'
import Title from './components/title'
export default {
  components: {
    Title
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,

      deviceSerialNo: '',

      prePath: '/home/parkMes',
      nextPath: '/home/rate',
      title: '车道配置',
      active: '1'
    }
  },
  mounted() {},
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 8; i++) {
      //     this.list.push(this.list.length + 1)
      //   }

      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 8) {
      //     this.finished = true
      //   }
      // }, 1000)
      this.deviceSerialNo = localStorage.getItem('deviceSerialNo')
      this.getGatewayInfo(this.deviceSerialNo)
    },
    getGatewayInfo(deviceId) {
      let reqParam = {
        deviceSerialNo: deviceId
      }
      getGatewayInfo(reqParam)
        .then(res => {
          if (res.code == 200) {
            this.list = res.data.gatewayList
          } else {
          }
          this.loading = false
          this.finished = true
        })
        .catch(res => {
          this.loading = false
          this.finished = true
        })
    },
    editGateway(deviceId, index) {
      this.$router.push({ path: '/home/CreatePark', query: { deviceSerialNo: deviceId, index: index } })
    },
    createGateway() {
      this.$router.push({ path: '/home/CreatePark' })
    },
    remove(item) {
      delete item.updateTime
      let reqParams = {
        opType: 'DEL',
        ...item
      }
      createGatewayInfo(reqParams)
        .then(res => {
          if (res.code == 200) {
            this.$toast('刪除成功')
            this.getGatewayInfo(this.deviceSerialNo)
          } else {
            this.$toast('刪除失败')
          }
        })
        .catch(res => {
          this.$toast('刪除失败')
        })
    },
    formatValue(deviceId) {
      return `设备${deviceId.substring(deviceId.length - 4)}`
    }
  }
}
</script>

<style scoped lang="scss">
.parkList {
  position: relative;
  .createPark {
    position: fixed;
    left: 0;
    bottom: 1rem;
    margin: 16px 0;
    width: 100%;
    /deep/.van-button--block {
      display: block;
      width: 50%;
      margin: auto;
    }
  }
  .step {
    margin-top: -0.75rem;
    margin-bottom: 0.4rem;
  }
}
</style>
