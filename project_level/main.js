import Vue from 'vue'
import App from './App'
import module from './ajax/api/index.js'
import userMixin from './common/rulesMixin.js'
import commonMixin from './common/commonMixin.js'
import store from './store'

// 引入路由相关组件
import {
	router,
	RouterMount
} from './router.js' //路径换成自己的
Vue.use(router)

Vue.use(userMixin)
Vue.use(commonMixin)
Vue.config.productionTip = false


App.mpType = 'app'
Vue.prototype.$http = module;

const app = new Vue({
	...App,
	store
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5	RouterMount(app, router, '#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
