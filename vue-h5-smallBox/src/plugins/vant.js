// 按需全局引入 vant组件
import Vue from 'vue'

//vue-amap 高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  key: '938224a5507669a4930431ab6d49b53f',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation'],
  uiVersion: '1.0.11' // 版本号
})

// 百度地图
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  // ak: 'D7e4QpcTdC2C0fbLAml9cx0ewetLZtt4'
  ak: 'D7e4QpcTdC2C0fbLAml9cx0ewetLZtt'
})
import {
  Button,
  List,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Uploader,
  Calendar,
  Collapse,
  CollapseItem,
  pullRefresh,
  Switch,
  Icon,
  Popup,
  DropdownMenu,
  DropdownItem,
  Picker,
  RadioGroup,
  Radio,
  Step,
  Steps,
  switchCell,
  Overlay,
  Loading,
  PullRefresh,
  Tabs,
  Tab,
  NavBar,
  Grid,
  GridItem,
  SwipeCell,
  Checkbox,
  CheckboxGroup,
  Swipe,
  SwipeItem,
  Col,
  Row,
  Dialog,
  Image as VanImage,
  Divider,
  Search,
  CountDown
  // Toast,
} from 'vant'
Vue.use(Button)
Vue.use(CountDown)
Vue.use(Search)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Dialog)
Vue.use(Col)
Vue.use(Row)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Grid)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(SwipeCell)
Vue.use(GridItem)
Vue.use(NavBar)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Loading)
Vue.use(Overlay)
Vue.use(switchCell)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Form)
// Vue.use(Toast)
Vue.use(Field)
Vue.use(Uploader)
Vue.use(Calendar)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(pullRefresh)
Vue.use(List)
Vue.use(Switch)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Picker)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Step)
Vue.use(Steps)
