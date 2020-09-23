<template>
  <div class="map">
    <baidu-map
      class="map"
      @ready="handler"
      style="height: 500px;"
      :center="center"
      :zoom="15"
      :map-click="false"
    >
      <div>
        <bm-marker
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE"
          :position="center"
          @dragend="dragend"
        ></bm-marker>
      </div>
    </baidu-map>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      center: ''
    }
  },
  mounted() {
    this.getAddress()
  },
  methods: {
    getAddress(deviceId) {
      let lnglat = '39.91488908'
      let lnglng = '116.40387397'
      axios
        .get(
          `http://restapi.amap.com/v3/geocode/regeo?key=938224a5507669a4930431ab6d49b53f&location=${lnglng},${lnglat}`
        )
        .then(res => {
          console.log('res')
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          this.$toast('转码失败')
        })
    },

    handler: function ({ BMap, map }) {
      map.enableScrollWheelZoom(true)
      // map.centerAndZoom('青岛市', 13)
      // const hide = this.$message.loading('正在获取当前省市请稍候..', 0)
      const hide = this.$toast('正在获取当前省市请稍候..', 0)
      const _this = this
      const geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(
        function (r) {
          setTimeout(hide, 1000)
          console.log(r)
          _this.center = { lng: r.longitude, lat: r.latitude } // 设置center属性值
          // _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }        // 自定义覆盖物
          _this.initLocation = true
        },
        { enableHighAccuracy: true }
      )

      window.map = map
      // 赋值，方便调用，本节被用到
      this.BMap = BMap
      this.map = map
    },
    // 拖动结束后
    dragend(e) {
      this.position = e.point
      const _this = this
      console.log(e.point)
      console.log(this.position)
      const gc = new this.BMap.Geocoder()
      gc.getLocation(e.point, function (rs) {
        console.log(rs)
        // var addComp = rs.addressComponents
        // this.addr = addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber
        _this.addr = rs.address
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
