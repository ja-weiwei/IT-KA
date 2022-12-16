<template>
	<view class="save-incons" @click.stop="_changeSaveStatus">
		<uni-icons color="#ff6600" :type=" isSave ? 'heart-filled':'heart'" :size="size"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "SaveLikes",
		props: {
			item: Object, //文章的id
			size: {
				type: String,
				default: '20'
			}
		},
		data() {
			return {};
		},
		methods: {
			async _changeSaveStatus() {
				// 判断用户是否登录
				await this.checkedisLogin() //promise对象
				const {
					newUserInfo,
					msg
				} = await this.$http.update_save_like({
					articleId: this.item._id, //文章id
					userId: this.userInfo._id //用户id
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				// 合并本地存储的用户信息
				this.updateUserInfo({
					...this.userInfo,
					...newUserInfo
				})
				
				// 当成功或取消收藏文章，传递事件给关注页面
				uni.$emit('updateArticle')
				// console.log(newUserInfo);

				// console.log(this.userInfo._id,"用户的id");
				// console.log(this.articleId,"文章的id");
				// 登录 改变当前的收藏状态
				// 没有登录 => 界面的跳转 => 用户登录的界面

			}
		},
		computed: {
			isSave() {
				// return this.userInfo && this.userInfo.article_likes_ids.includes(this.item._id)
				// h5和小程序容错解决
				try {
					return this.userInfo && this.userInfo.article_likes_ids.includes(this.item._id)
				} catch (error) {
					return false
				}
			}
		}

	}
</script>

<style>

</style>
