// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import store from './store/index.js'

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// 拦截条件
	// 在没有用户信息和要跳转的页面所需要登录权限则进行拦截
	// console.log(to);	
	if (!store.state.userInfo && to.meta.needLogin) {
		// console.log(store.state.userInfo);
		next({
			name: 'login',
			NAVTYPE: "push" //跳转到普通页面，新开保留历史记录
		});
	} else {
		// console.log(to);
		next();

	}

});

// // 全局路由后置守卫
// router.afterEach((to, from) => {
//     console.log('跳转结束')
// })

export {
	router,
	RouterMount
}
