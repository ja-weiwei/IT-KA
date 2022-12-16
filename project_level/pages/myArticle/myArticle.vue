<template>
	<view>
		<ListCard v-if="!articleDataNode" :item="item" v-for="(item,index) in articleList" :key="index"></ListCard>
		<view v-if="articleDataNode" class="no-data">您还没有发布过任何的文章</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this._getMyArticle();
		},
		data() {
			return {
				articleList: [],
				articleDataNode:''
			}
		},
		methods: {
			async _getMyArticle(){
				const list = await this.$http.get_my_article({userId:this.userInfo._id})
				if (list.length) {
					this.articleDataNode = ''
				} else {
					this.articleDataNode = true
				}
				this.articleList = list
			}
		}
	}
</script>

<style lang="scss">
	.no-data{
		height: 400rpx;
		width: 100%;
		line-height: 400rpx;
		text-align: center;
		color: #666;
		font-size: 24rpx;
	}

</style>
