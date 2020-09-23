<template>
  <div class="app-container">
    <div id="map-container" style="width:100%;height:400px;" />
    <!-- <van-field v-model="location" label="地区：" /> -->
    <van-field readonly v-model="coordinateLng" name="coordinateLng" label="经度坐标" />
    <van-field readonly v-model="coordinateLat" name="coordinateLat" label="纬度坐标" />
    <van-field readonly v-model="address" name="coordinateLat" label="地址" />
    <div style="margin: 16px">
      <van-button round block type="info" @click="selectLng">确定选择</van-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import loadBMap from '@/utils/loadBMap.js'
export default {
  data() {
    return {
      form: {
        address: '', // 详细地址
        addrPoint: {
          // 详细地址经纬度
          lng: 0,
          lat: 0
        }
      },
      map: '', // 地图实例
      mk: '', // Marker实例

      coordinateLng: '',
      coordinateLat: '',
      address: '',
      locationPoint: null,

      location: '北京',
      keyword: '百度'
    }
  },
  async mounted() {
    // await loadBMap("oW2UEhdth2tRbEE4FUpF9E5YVDCIPYih"); // 加载引入BMap
    // await loadBMap('D7e4QpcTdC2C0fbLAml9cx0ewetLZtt4') // 加载引入BMap
    // 这个写错误的ak并不会弹窗报错
    await loadBMap('D7e4QpcTdC2C0fbLAml9cx0ewetLZtt') // 加载引入BMap
    this.initMap()
  },
  methods: {
    // 初始化地图
    initMap() {
      var that = this

      // 1、挂载地图
      this.map = new BMap.Map('map-container', { enableMapClick: false })
      var point = new BMap.Point(113.3324436, 23.1315381)
      console.log('pointvvv')
      console.log(point)
      this.map.centerAndZoom(point, 19)

      // 3、设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMap.Marker(point, { enableDragging: true })
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function (e) {
        that.getAddrByPoint(e.point)
      })

      // 4、添加（右上角）平移缩放控件
      this.map.addControl(
        new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_SMALL
        })
      )

      // 5、添加（左下角）定位控件
      var geolocationControl = new BMap.GeolocationControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT
      })
      geolocationControl.addEventListener('locationSuccess', function (e) {
        that.getAddrByPoint(e.point)
      })
      geolocationControl.addEventListener('locationError', function (e) {
        alert(e.message)
      })
      this.map.addControl(geolocationControl)

      // 6、浏览器定位
      this.geolocation()

      // 7、绑定点击地图任意点事件
      this.map.addEventListener('click', function (e) {
        that.getAddrByPoint(e.point)
      })
    },
    // 获取两点间的距离
    getDistancs(pointA, pointB) {
      return this.map.getDistance(pointA, pointB).toFixed(2)
    },
    // 浏览器定位函数
    geolocation() {
      var that = this
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(
        function (res) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            that.getAddrByPoint(res.point)
            that.locationPoint = res.point
          } else {
            alert('failed' + this.getStatus())
            that.locationPoint = new BMap.Point(113.3324436, 23.1315381)
          }
        },
        { enableHighAccuracy: true }
      )
    },
    // 2、逆地址解析函数
    getAddrByPoint(point) {
      var that = this
      var geco = new BMap.Geocoder()
      geco.getLocation(point, function (res) {
        console.log('逆地址')
        console.log(res)
        let {
          // addressComponent: { province, city, street },
          address,
          point: { lng, lat }
        } = res
        that.coordinateLng = lng
        that.coordinateLat = lat
        that.address = address
        that.mk.setPosition(point)
        that.map.panTo(point)
        that.form.address = res.address
        that.form.addrPoint = point
      })
    },
    // 8-1、地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function (res) {
          var s = []
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i))
            }
            cb(s)
          } else {
            cb(s)
          }
        }
      }
      var local = new BMap.LocalSearch(this.map, options)
      local.search(str)
    },
    // 8-2、选择地址
    handleSelect(item) {
      this.form.address = item.address + item.title
      this.form.addrPoint = item.point
      this.map.clearOverlays()
      this.mk = new BMap.Marker(item.point)
      this.map.addOverlay(this.mk)
      this.map.panTo(item.point)
    },
    onSubmit() {
      console.log(this.form)
    },
    selectLng() {
      let data = {
        coordinateLng: this.coordinateLng,
        coordinateLat: this.coordinateLat,
        address: this.address
      }
      this.$emit('func', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.autoAddressClass {
  li {
    i.el-icon-search {
      margin-top: 11px;
    }
    .mgr10 {
      margin-right: 10px;
    }
    .title {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .address {
      line-height: 1;
      font-size: 12px;
      color: #b4b4b4;
      margin-bottom: 5px;
    }
  }
}
</style>

