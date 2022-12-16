<template>
	<view class="home-container">
		<NavBar></NavBar>
		<!-- 添加侧边栏 -->
		<TabBar :labelList="labelList" :activeIndex="activeIndex" @changeCurrentIndex="changeCurrentIndex"></TabBar>
		<!-- 文章列表组件 -->
		<ArticleList :labelList="labelList" class="list-container" :activeIndex="activeIndex"
			@changeCurrentIndex="changeCurrentIndex"></ArticleList>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		onLoad() {
			this._intiLabelList()
		},
		data() {
			return {
				// labelList: [],
				activeIndex: 0
			}
		},
		methods: {
			async _intiLabelList() {
				if (this.labelList.length) return
				const labelList = await this.$http.get_label_list()
				this.setLabelList([{
					name: "全部"
				}, ...labelList])
			},
			/* 修改当前activeIndex值 */
			changeCurrentIndex(index) {
				this.activeIndex = index
			},
			...mapMutations(['setLabelList'])
		},
		computed: {
			labelList() {
				if (this.userInfo) {
					this.activeIndex = 0;
					return [...this.$store.state.labelList.slice(0, 1), ...this.$store.state.labelList.filter(item =>
						this.userInfo.label_ids?.includes(item._id))]
				} else {
					return this.$store.state.labelList
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home-container {
		overflow: hidden;
		flex: 1;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}

	.list-container {
		flex: 1;
		box-sizing: border-box;
	}
</style>
