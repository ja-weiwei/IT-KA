<!-- 文章详情页面 -->
<template>
	<view class="article-detail-contaner">
		<!-- 标题 -->
		<view class="detail-title">
			{{articleData.title}}
		</view>

		<!-- 头部 -->
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{articleData.author.author_name}}
				</view>
				<view class="detail-header-content-info">
					<text>{{articleData.create_time}}</text>
					<text>{{articleData.browse_count}} 浏览</text>
					<text>{{articleData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">
				{{isFollowAuthor?'取消关注':'关注'}}
			</button>
		</view>

		<!-- 文本内容 -->
		<view class="detail-content-container">
			<view class="detail-html">
				<!-- <u-parse :content="content"></u-parse> -->
				<u-parse className="markdown-body" :content="content" noData="加载中..."></u-parse>
			</view>
			<!-- 评论内容部分 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content-container" v-for="(item,index) in commentList" :key="index">
					<CommentBox @commentReply="commentReply" :commentData="item"></CommentBox>
				</view>
				<view class="no-data" v-if="!commentList.length">
					暂无评论
				</view>
			</view>
		</view>

		<!-- 评论输入组件 -->
		<view class="detail-bottom">
			<view @click="openMaskerComment" class="input-container">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icons-box" @click="goCommentPage">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<SaveLikes class="detail-bottom-icons-box" :item="articleData"></SaveLikes>
				<!-- <view class="detail-bottom-icons-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view> -->
				<view class="detail-bottom-icons-box">
					<uni-icons :type="isCompliments?'hand-thumbsup-filled':'hand-thumbsup'" size="22" color="#f07373"
						@click="_updateCompliments"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<CommentMaskor :showPopup="showPopup" @clsePopupMasker="showPopup=$event" @sendCommentData="sendCommentData">
		</CommentMaskor>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	import {
		marked
	} from 'marked'

	export default {
		components: {
			uParse
		},
		onLoad(...options) {
			// console.log(JSON.parse(options[0].params));
			// this.articleData = JSON.parse(options[0].params)
			// console.log(this.$Router);
			this.articleData = this.$Router.currentRoute.query
			// 文章详情的获取
			this._getArticleDetail()
			// 初始化获取评论列表
			this._getCommentList()
		},
		data() {
			return {
				articleData: null,
				showPopup: false, //是否打开遮罩层
				commentList: [], //评论内容
				replyData: {},
			}
		},
		methods: {
			async _getArticleDetail() {
				const data = await this.$http.get_article_datail({
					article_id: this.articleData._id
				})
				// console.log(data);
				this.articleData = data
			},
			// 打开弹窗遮罩层
			async openMaskerComment() {
				await this.checkedisLogin()
				this.showPopup = true;
			},
			// 发送评论内容到后端
			async sendCommentData(content) {

				const {
					msg
				} = await this.$http.update_comment({
					articleId: this.articleData._id,
					userId: this.userInfo._id,
					content,
					...this.replyData
				})
				uni.showToast({
					title: msg
				})
				this.showPopup = false
				// 修改评论内容成功之后，进行数据（评论列表的更新）
				this.replyData = {}
				// 评论成功重新获取评论列表
				this._getCommentList()

			},
			// 获取文章评论列表
			async _getCommentList() {
				// 发送id
				const listArrr = await this.$http.get_comments({
					articleId: this.articleData._id
				})
				this.commentList = listArrr
				console.log(listArrr);
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
			// 改变用户关注作者的状态
			async _followAuthor() {
				// 先检查登录状态
				await this.checkedisLogin()
				const {
					msg
				} = await this.$http.update_follow_author({
					authorId: this.articleData.author.id, //作者id
					userId: this.userInfo._id //用户id
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				// 改变store里面的用户存储的状态 => 本地存储同样修改
				let followIds = [...this.userInfo.author_likes_ids];
				if (followIds.includes(this.articleData.author.id)) {
					followIds = followIds.filter(item => item != this.articleData.author.id);
				} else {
					followIds.push(this.articleData.author.id)
				}
				console.log(followIds);
				this.updateUserInfo({
					...this.userInfo,
					author_likes_ids: followIds
				})
				// 当成功或取消关注作者，传递事件给关注页面
				uni.$emit('updateAutho')
			},
			// 是否对文章点赞
			async _updateCompliments() {
				const {
					msg
				} = await this.$http.update__compliments({
					articleId: this.articleData._id, //文章id
					userId: this.userInfo._id //用户id
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				// 改变store里面的用户存储的状态 => 本地存储同样修改
				// 修改用户的点赞数组的存储
				let thumbsArr = [...this.userInfo.thumbs_up_article_ids];
				if (thumbsArr.includes(this.articleData._id)) {
					thumbsArr = thumbsArr.filter(item => item != this.articleData._id);
					this.articleData.thumbs_up_count -=1 
				} else {
					thumbsArr.push(this.articleData._id)
					this.articleData.thumbs_up_count +=1
				}
				console.log(thumbsArr);
				this.updateUserInfo({
					...this.userInfo,
					thumbs_up_article_ids: thumbsArr
				})
			},
			// 跳转到评论页面
			goCommentPage(){
				uni.navigateTo({
					url:`/pages/commentList/commentList?articleId=${this.articleData._id}`
				})
			}
		},
		computed: {
			content() {
				// return marked(this.articleData.content)
				// console.log(marked(this.articleData.content));
				try {
					return marked(this.articleData.content)
				} catch (error) {
					return null
				}
			},
			// 是否关注作者
			isFollowAuthor() {
				// 作者的id
				// return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id)
				try {
					return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id)
				} catch (error) {
					return false
				}
			},
			// 是否对文章进行点赞
			isCompliments() {
				// 作者的id
				// return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id)
				try {
					return this.userInfo && this.userInfo.thumbs_up_article_ids.includes(this.articleData._id)
				} catch (error) {
					return false
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import 'css/articleDetail.scss'
</style>
