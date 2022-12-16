import {
	mapState,
	mapMutations
} from 'vuex'
export default {
	install(Vue) { // 使用install的形式进行安装mixin
		Vue.mixin({
			data() {
				return {}
			},
			methods: {
				async checkedisLogin() {
					// 当用户收藏文章查看有没有登录
					// 获取用户的信息
					return new Promise(resolve => {
						if (this.userInfo) {
							resolve()
						} else {
							uni.navigateTo({
								url: '/pages/userInfo/login/login'
							})
						}
					})
				},
				 ...mapMutations(['updateUserInfo'])
			},
			computed: {
				...mapState(['userInfo'])
			}

		})
	}
}
