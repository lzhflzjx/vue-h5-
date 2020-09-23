<template>
  <div class="map">
    <div class="amap-page-container">
      <el-amap vid="amap" :zoom="zoom" :plugin="plugin" class="amap-demo" :center="center"></el-amap>
      <div class="toolbar">
        <span v-if="loaded">location: lng = {{ lng }} lat = {{ lat }}</span>
        <span v-else>正在定位</span>
      </div>
    </div>
    <van-field v-model="lng" center clearable label="经度坐标"></van-field>
    <van-field v-model="lat" center clearable label="纬度坐标"></van-field>
    <van-field v-model="address" center clearable label="地址"></van-field>
    <div style="margin: 16px">
      <van-button round block type="info" @click="confirm">提交</van-button>
    </div>
    <!-- <div>{{info}}</div>
    <div>{{location_type}}</div>
    <div>{{message}}</div>
    <div>{{address}}</div>
    <div>{{formatted_address}}</div>-->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    let self = this
    return {
      center: [121.59996, 31.197646],
      zoom: 17,
      lng: 0,
      lat: 0,
      info: '',
      location_type: '',
      message: '',
      loaded: false,
      address: '',
      formatted_address: '',
      // plugin: ['MapType']
      plugin: [
        //一些工具插件
        {
          pName: 'Geolocation', //定位
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log('result')
                console.log(result)
                console.log(status)
                if (status == 'error') {
                  self.message = result.message
                  return
                }
                let {
                  info,
                  location_type,
                  message,
                  position: { lat, lng }
                } = result
                self.info = info
                self.location_type = location_type
                self.message = message
                self.lat = lat
                self.lng = lng
                self.getAddress(lng, lat)
                // if (result && result.position) {
                //   self.lng = result.position.lng //设置经度
                //   self.lat = result.position.lat //设置维度
                //   self.center = [self.lng, self.lat] //设置坐标
                //   self.loaded = true //load
                //   self.$nextTick() //页面渲染好后
                // }
              })
            }
          }
        },
        {
          pName: 'ToolBar', //工具栏
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'OverView', //鹰眼
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'MapType', //地图类型
          defaultType: 0,
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'Scale', //比例尺
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        }
      ]
    }
  },
  mounted() {},
  methods: {
    getAddress(lng, lat) {
      axios
        .get(`https://restapi.amap.com/v3/geocode/regeo?key=938224a5507669a4930431ab6d49b53f&location=${lng},${lat}`)
        .then(res => {
          if (res.data.status == '1') {
            let {
              addressComponent: { province, district, township },
              formatted_address
            } = res.data.regeocode
            this.address = `${province}${district}${township}`
            this.formatted_address = formatted_address
          }
          else{
            this.$toast('逆地理编码失败')
          }
        })
        .catch(err => {
          this.$toast('逆地理编码失败')
        })
    },
    confirm() {
      // coordinateLng, coordinateLat, address
      let data = {
        coordinateLng: this.lng,
        coordinateLat: this.lat,
        address: this.address
      }
      this.$emit('func', data)
    }
  }
}
</script>

<style scoped lang="scss">
.amap-page-container {
  position: relative;
  width: 100%;
  margin-top: 0.03rem;
  height: 500px;
  font-size: 0.12rem;
  color: #fff;
}
</style>
