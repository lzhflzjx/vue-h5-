<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="输入车场名字检索"
        @clear="onClear"
        @search="onSearch"
        @cancel="onCancel"
      />
      <!--  -->
    </form>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- <van-cell v-for="item in list" :key="item" :title="item.parkName" @click="createPark(item.deviceSerialNo)">
        设备{{ item.deviceSerialNo.substring(item.deviceSerialNo.length - 4) }}
      </van-cell>-->
      <van-swipe-cell v-for="(item,index) in list" :key="index">
        <van-cell
          :border="false"
          :title="item.parkName"
          @click="createPark(item.deviceSerialNo)"
          :value="formatValue(item.deviceSerialNo)"
        />
        <!-- <template #right>
          <van-button square type="danger" text="删除" @click="remove()" />
        </template>-->
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<script>
import { getDeviceList } from '@/api/home.js'
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageIndex: '1',

      value: ''
    }
  },
  mounted() {
    // this.getDeviceList()
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.getDeviceList()
      // setTimeout(() => {
      //   // for (let i = 0; i < 10; i++) {
      //   //   this.list.push(this.list.length + 1)
      //   // }
      //   this.getDeviceList()
      //   // 加载状态结束
      //   this.loading = false

      //   // // 数据全部加载完成
      //   // if (this.list.length >= 40) {
      //   //   this.finished = true
      //   // }
      // }, 1000)
    },
    // 获取车场信息采集列表接口
    getDeviceList(parkName, pageIndex) {
      if (this.finished) {
        console.log('已加载全部数据')
        return
      }
      let accessToken = localStorage.getItem('accessToken-A')
      let agentId = localStorage.getItem('agentId-A')
      let reqParams = {
        agentId: agentId, // 	String	是	代理商ID
        pageIndex: pageIndex || this.pageIndex, // 	Integer	是	第几页
        pageSize: '10', // 	Integer	是	每页多少条
        accessToken: accessToken, // 	String	是	Token授权
        parkName: parkName // 	String	是	设备
      }
      getDeviceList(reqParams)
        .then(res => {
          if (res.code) {
            if (res.data.list.length < 10) {
              this.list.push(...res.data.list)
              
              // this.pageIndex = Number(this.pageIndex) + 1
              console.log('stop')
              this.loading = false
              this.finished = true
            } else {
              this.list.push(...res.data.list)
              console.log("this.list")
              console.log(this.list)
              this.pageIndex = Number(this.pageIndex) + 1
              this.loading = false
            }
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    createPark(deviceSerialNo) {
      this.$router.push({ path: '/home/parkMes', query: { deviceSerialNo: deviceSerialNo } })
    },
    formatValue(deviceId) {
      if (deviceId) {
        return `设备${deviceId.substring(deviceId.length - 4)}`
      }
    },
    onSearch(val) {
      this.getDeviceList(val, '1')
    },
    onCancel() {
      this.getDeviceList(null, '1')
    },
    onClear() {
      this.getDeviceList(null, '1')
    }
  }
}
</script>

<style scoped lang="scss"></style>
