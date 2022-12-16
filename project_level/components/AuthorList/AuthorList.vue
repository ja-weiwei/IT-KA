<template>
	<view class="list-scroll-container">
		<scroll-view scroll-y="true" class="list-scroll">
			<view class="author-card" v-for="(item,index) in authorList" :key="index">
				<view class="author-image-container">
				 <image :src='item.avatar' mode="aspectFill"></image>
				</view>
				<view class="author-desc-container">
					<view class="author-info-title">
						{{item.author_name}}
					</view>
					<view class="author-info-bottom">
						<view class="author-info-left">
							{{item.professional}}
						</view>
						<view class="author-info-right">
							<view class="author-card-desc">
								发帖 {{item.article_ids.length}}
							</view>
							<view class="author-card-desc">
								粉丝 {{item.fans_count}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <uni-load-more v-if="isShowLoadMore && (articleList.length === 0 || articleList.length> 7)" :status="loadData.loading || 'loading'"></uni-load-more> -->
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "AuthorList",
		props: {
			authorList: Array
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.list-scroll-container {
		height: 100%;

		.list-scroll {
			height: 100%;

			.author-card {
				@include flex(flex-start);
				align-items: flex-start;
				border-bottom: 1px solid #f5f5f5;
				padding: 28rpx 0;
				margin: 0 20rpx;
				box-sizing: border-box;

				.author-image-container {
					flex-shrink: 0;
					width: 80rpx;
					height: 80rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}
				.author-desc-container{
					flex-grow: 1;
					@include flex(space-between,column)
					align-items: flex-start;
					padding-left: 20rpx;
					height: 80rpx;
					.author-info-title{
						font-size: 28rpx;
						font-weight: bold;
						color: #333;
						line-height: 1.2;
					}
					.author-info-bottom{
						@include flex()
						width: 100%;
						line-height: 1.5;
						font-size: 24rpx;
						color: #666;
						.author-info-right{
							@include flex(flex-start)
							.author-card-desc{
								margin-left: 20rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
