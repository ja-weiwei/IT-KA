<template>
	<view>
		<view class="comment-content-container" v-for="(item,index) in commentList" :key="index">
			<CommentBox @commentReply="commentReply" :commentData="item"></CommentBox>
		</view>
		<uni-load-more v-if="commentList.length === 0 || commentList.length > 5" :status="loading" :contentText=" {
						contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多评论'
			}"></uni-load-more>
		<!-- 评论组件 -->
		<CommentMaskor :showPopup="showPopup" @clsePopupMasker="showPopup=$event" @sendCommentData="_sendCommentData">
		</CommentMaskor>
	</view>
</template>

<script>
	export default {
		// 页面生命周期: 监听页面加载，其参数为上个页面传递的数据
		onLoad(props) {
			// console.log(props);
			this.articleId = props.articleId
			this._getCommentList()
		},
		// 页面生命周期: 页面滚动到底部的事件
		onReachBottom() {
			if (this.loading === 'noMore') return
			this.page++
			this._getCommentList()
		},
		data() {
			return {
				articleId: '',
				pageSize: 5,
				page: 1,
				commentList: [],
				loading: 'loading',
				showPopup: false,
				replyData: {}
			}
		},
		methods: {
			async _getCommentList() {
				// 发送id
				const list = await this.$http.get_comments({
					articleId: this.articleId,
					pageSize: this.pageSize,
					page: this.page
				})

				if (list.length === 0) {
					this.loading = 'noMore'
					return
				}

				let oldList = JSON.parse(JSON.stringify(this.commentList)) //[]
				oldList.push(...list) //
				this.commentList = oldList
				console.log(list);
			},
			// 打开弹窗遮罩层
			async openMaskerComment() {
				await this.checkedisLogin()
				this.showPopup = true;
			},
			// 处理回复评论事件函数
			commentReply(data) {
				this.replyData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply
				}
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id)
				this.openMaskerComment();
			},
			// 发送评论内容到后端
			async _sendCommentData (content){
				const {
					msg
				} = await this.$http.update_comment({
					userId: this.userInfo._id, //用户id
					articleId: this.articleId, //文章id
					content,
					...this.replyData
				})
				uni.showToast({
					title: msg
				})
				this.showPopup = false
				// 评论成功重新获取评论列表
				this._getCommentList()
				this.page = 1
				this.commentList = []
				this.loading = 'loading'
				// 修改评论内容成功之后，进行数据（评论列表的更新）
				this.replyData = {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-content-container {
		padding: 0 30rpx;
		border-bottom: 1px solid #eee;
	}
</style>
