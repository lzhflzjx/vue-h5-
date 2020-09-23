<template>
  <div class="AreaList">
    <div class="selectArea">
      <van-cell title="选择区域" class="left" />
      <van-dropdown-menu class="right">
        <van-dropdown-item
          v-model="value1"
          :lazy-render="false"
          @change="select1"
          :options="option1"
        />
        <van-dropdown-item
          v-model="value2"
          :lazy-render="false"
          @change="select2"
          :options="option2"
        />
        <van-dropdown-item
          @change="select3"
          v-model="value3"
          :lazy-render="false"
          :options="option3"
        />
      </van-dropdown-menu>
    </div>
  </div>
</template>

<script>
import { getAreaList } from '@/api/home.js'
export default {
  props: {
    array: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    array(newVal, OldVal) {
      console.log('newVal')
      console.log(newVal)
      this.array = newVal
      let array = newVal
      this.getAreaList2(array[0])
      this.getAreaList3(array[1])
      this.value1 = array[0]
      this.value2 = array[1]
      this.value3 = array[2]
    }
  },
  data() {
    return {
      value1: '1',
      value2: '2',
      value3: '3',
      option1: [{ text: '选择省', value: '1' }],
      option2: [{ text: '选择市', value: '2' }],
      option3: [{ text: '选择区县', value: '3' }]
    }
  },
  mounted() {
    console.log('Array')
    console.log(this.array)
    this.getAreaList1()
  },
  methods: {
    // 获取区域下拉列表接口
    getAreaList1(code) {
      let reqParams = {
        areaCode: '0' //设备序列号
      }

      getAreaList(reqParams)
        .then(res => {
          res.data.forEach(element => {
            this.option1.push({
              text: element.areaName,
              value: element.areaCode
            })
          })
        })
        .catch()
    },
    getAreaList2(code) {
      let reqParams = {
        areaCode: code //设备序列号
      }
      getAreaList(reqParams)
        .then(res => {
          res.data.forEach(element => {
            this.option2.push({
              text: element.areaName,
              value: element.areaCode
            })
          })
        })
        .catch()
    },
    getAreaList3(code) {
      let reqParams = {
        areaCode: code //设备序列号
      }
      getAreaList(reqParams)
        .then(res => {
          res.data.forEach(element => {
            this.option3.push({
              text: element.areaName,
              value: element.areaCode
            })
          })
        })
        .catch()
    },
    select1(value) {
      this.value2 = '2'
      this.value3 = '3'
      this.option2 = [{ text: '选择市', value: '2' }]
      this.option3 = [{ text: '选择区县', value: '3' }]
      this.getAreaList2(value)
    },
    select2(value) {
      this.value3 = '3'
      this.option3 = [{ text: '选择区县', value: '3' }]
      this.getAreaList3(value)
    },
    select3(value) {
      console.log('sel3')
      console.log(value)
      this.$emit('func', value)
      // this.value3 = '3'
      // this.option3 = [{ text: '选择区县', value: '3' }]
      // this.getAreaList3(value)
    }
  }
}
</script>

<style scoped lang="scss">
.selectArea {
  display: flex;
  .left {
    flex: none;
    box-sizing: border-box;
    width: 6.5em;
    color: #646566;
    text-align: left;
    word-wrap: break-word;
  }
  .right {
    width: 75%;
  }
}
</style>
