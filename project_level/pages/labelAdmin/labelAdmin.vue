<!-- 编辑标签页面 -->
<template>
	<view class="label-container">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					我的标签
				</view>
				<view class="label-edit" @click="changeEditStatus">
					{{ isEdit ?'完成':'编辑'}}
				</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item,index) in selfLabelList">
					{{item.name}}
					<uni-icons @click="deleteLabelItem(item)" v-if="isEdit" class="icon-close" type="clear" size="20" color="red"></uni-icons>
				</view>
				<view v-if="!selfLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<!-- 标签推荐 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					标签推荐
				</view>
			</view>
			<view class="label-content">
				<view @click="changeSelfLabelList(item)" class="label-content-item" v-for="(item,index) in recommendLabelList">
					{{item.name}}
				</view>
				<view v-if="!recommendLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				isEdit:false,
				labelIds:[]
			}
		},
		watch:{
			userInfo:{
				immediate:true,
				handler(newVal,oldVal){
					console.log(this.userInfo.label_ids);
					this.labelIds = this.userInfo.label_ids;
				}
			}
		},
		methods: {
			// 调整编辑的状态
			changeEditStatus(){
				// 编辑完成，状态为true 触发_updateLabel该函数
				this.isEdit && this._updateLabel()
				this.isEdit = !this.isEdit
			},
			// 修改完毕发送给后端
			async _updateLabel(){
				console.log("完成了");
				// user 信息 userInfo._id ids => []
				console.log(this.selfLabelList);
				const label_ids = this.selfLabelList.map(item => item._id)
				const {msg} = await this.$http.update_label_ids({userId:this.userInfo._id,label_ids})
				uni.showToast({
					title:msg,
					icon:'success'
				})
				this.updateUserInfo({...this.userInfo,label_ids})
			},
			// 添加标签
			changeSelfLabelList(item){
				// 如果非编辑状态 则return
				if(!this.isEdit) return
				this.labelIds.push(item._id)
			},
			// 移除标签
			deleteLabelItem(item){
				if(!this.isEdit) return
				this.labelIds = this.labelIds.filter(id => id !== item._id)
			}
		},
		computed:{
			...mapState(['labelList']),
			// labelList,
			selfLabelList(){
				// console.log(this.labelIds,this.labelList);
				return this.labelList.filter(item => this.labelIds.includes(item._id))
			},
			recommendLabelList(){
				// 取反 并且取没有id值
				return this.labelList.filter(item => !this.labelIds.includes(item._id) && item._id)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './css/labelAdmin.scss'
</style>
