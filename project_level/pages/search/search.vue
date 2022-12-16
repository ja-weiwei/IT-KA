<!-- 搜索页面 -->
<template>
	<view class="search-container">
		<!-- 搜索导航组件引入 -->
		<NavBar @endSearchData="_sendSearchData" :isSearch="isSearch" :parentVal="parentVal"
			@updateVal='parentVal=$event'></NavBar>
		<!-- 搜索容器 -->
		<!-- 没有进行搜索操作 -->
		<view v-if="isShowHistory" class="search-wrapper">
			<view class="search-history-container">
				<!-- 头部内容 -->
				<view class="search-header">
					<text class="history-text">搜索历史</text>
					<text @click="cleanHistory" class="history-clean">清空</text>
				</view>
				<!-- 内部部分 -->
				<view v-if="historyList.length" class="search-history-content">
					<view @click="openHistory(item)" class="history-content-item" v-for="(item,index) in historyList" :key="index">
						{{item}}
					</view>
				</view>
				<!-- 没有内容 -->
				<view v-else class="no-data">
					当前没有搜索历史
				</view>
			</view>
		</view>
		<!-- 开始进行搜索操作 -->
		<view v-else class="search-list-container">
			<ListItem @saveSearchHistory="saveSearchHistory" :isShowLoadMore="false" :articleList="searchList" v-if="searchList.length"></ListItem>
			<view v-else class="no-data">
				没有搜索到相关数据
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations,mapState } from 'vuex';
	export default {
		data() {
			return {
				isSearch: true,
				searchList: [],
				parentVal: '',
				isShowHistory:true
			}
		},
		methods: {
			// 发送数据到云函数
			async _sendSearchData() {
				this.isShowHistory = false
				// 搜索内容为空的时候
				if (!this.parentVal){
					this.isShowHistory = true
					this.searchList = []
					return
				}
				   
				const {
					articleList
				} = await this.$http.get_search_data({
					searchVal: this.parentVal
				})
				this.searchList = articleList
				console.log(articleList);

			},
			// 进行收藏历史记录操作
			saveSearchHistory(){
				this.setHistory(this.parentVal)
			},
			// 通过点击搜索历史记录进行搜索
			openHistory(val){
				this.parentVal = val
				this._sendSearchData()
			},
			...mapMutations(['setHistory','cleanHistory'])
		},
		computed:{
			...mapState(['historyList'])
		}
	}
</script>

<style lang="scss" scoped>
	@import 'css/search.scss'
</style>
