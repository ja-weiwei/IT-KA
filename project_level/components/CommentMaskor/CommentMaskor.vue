<!-- 文章评论组件 弹出层 -->
<template>
	<view>
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<!-- 内容区域 -->
			<view class="popup-wrapper">
				<view class="popup-header">
					<view class="popup-header-item" @click="clsePopupMasker">
						取消
					</view>
					<view class="popup-header-item" @click="sendCommentData">
						发布
					</view>
				</view>
				<view class="popup-content">
					<textarea class="popup-content-arear" v-model.trim="commentsVal" placeholder="请输入评论内容" maxlength="200"></textarea>
					<view class="popup-content-count">
						{{commentsVal.length ? commentsVal.length + '/200' : 0 + '/200'}}
					</view>
				</view>
			</view>
			
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name:"CommentMaskor",
		props:{
			showPopup:Boolean
		},
		// mounted() {
		// 	this.$refs.popup.open()
		// },
		watch:{
			showPopup(newVal){
				newVal ? this.$refs.popup.open(): this.$refs.popup.close()
			}
		},
		data() {
			return {
				commentsVal:''
			}; 
		},
		methods: {
			// 关闭弹窗的触发事件
			clsePopupMasker() {
				this.$emit("clsePopupMasker",false)
			},
			// 通知父组件进行评论内容的发送
			sendCommentData(){
				if(!this.commentsVal){
					uni.showToast({
						title:'请输入评论内容',
						icon:'none'
					})
					return
				}
				console.log("11");
				this.$emit("sendCommentData",this.commentsVal)
				this.commentsVal = ''
				
			}
		},
	}
</script>



<style lang="scss">
.popup-wrapper{
	background-color: #fff;
	.popup-header{
		@include flex();
		font-size: 28rpx;
		color: #6666;
		border-bottom: 1px solid #f5f5f5;
		.popup-header-item{
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
		}
	}
	.popup-content{
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		.popup-content-arear {
			height: 400rpx;
			width: 100;
		}
		.popup-content-count{
			@include flex(flex-end)
			font-size: 24rpx;
			color: $c-9;
		}
	}
}
</style>