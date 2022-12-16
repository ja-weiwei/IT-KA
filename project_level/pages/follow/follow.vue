<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:currentIndex === 0}" @click="currentIndex=0">
					文章
				</view>
				<view class="follow-tab-item" :class="{active:currentIndex === 1}" @click="currentIndex=1">
					作者
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex = $event.detail.current">
				<!-- 文章列表 -->
				<swiper-item :class="{'no-data':articleDataNone}">
					{{articleDataNone && '暂无收藏文章'}}
					<ListItem v-if="articleList.length" :articleList="articleList" :isShowLoadMore="isShowLoadMore">
					</ListItem>
					<!-- <view class="no-data"> 暂无收藏文章 </view> -->
				</swiper-item>
				<!-- 关注作者 -->
				<swiper-item>
					<AuthorList v-if="authorList.length" :authorList="authorList"></AuthorList>
					<view v-if="authorDataNone" class="no-data"> 暂无关注作者 </view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		// 页面加载时
		onLoad() {
			// #ifdef MP-WEIXIN
			if (!this.userInfo) {
				uni.redirectTo({
					url: '/pages/userInfo/login/login'
				})
				return
			}
			// #endif

			// 监听SaveLikes组件传递事件函数
			uni.$on('updateArticle', (e) => {
				this._getFollowArticle('noLoading')
			})
			this._getFollowArticle()

			// 监听articleDetail组件传递事件函数
			uni.$on('updateAutho', (e) => {
				this._getAuthorList('noLoading')
			})
			this._getAuthorList()
		},
		data() {
			return {
				currentIndex: 0,
				articleList: [],
				isShowLoadMore: false,
				articleDataNone: '',
				authorDataNone: '',
				authorList: []
			}
		},
		methods: {
			// 获取收藏文章
			async _getFollowArticle(isLoading) {
				const list = await this.$http.get_follow_article({
					userId: this.userInfo._id,
					isLoading
				})
				if (list.length) {
					this.articleDataNone = ''
				} else {
					this.articleDataNone = true
				}
				this.articleList = list
				console.log(list);
			},
			// 请求关注的作者列表
			async _getAuthorList(isLoading) {
				const list = await this.$http.get_follow_author({
					userId: this.userInfo._id,
					isLoading
				})
				if (list.lengt) {
					this.authorDataNone = ''
				} else {
					this.authorDataNone = true
				}
				this.authorList = list
				console.log(list);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'css/follow.scss'
</style>
