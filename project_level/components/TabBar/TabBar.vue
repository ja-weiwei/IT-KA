<template>
	<view class="tab">
		<!-- 滚动区域 -->
		<scroll-view class="tab-scroll" scroll-x="true" :scroll-into-view="currentIndex" :scroll-with-animation="true">
			<view class="tab-scroll-box">
				<view :id="`item${index}`" @click="navClickFn(index)" :class="{active:activeIndex === index}"
					v-for="(item, index) in labelList" :key="index" class="tab-scroll-item">{{ item.name}}</view>
			</view>
		</scroll-view>
		<view class="tab-icons">
			<uni-icons @click="goLabelAdmin" type="gear" size="26" color="#666"></uni-icons>
		</view>
		<!-- 设置图标 -->
	</view>
</template>

<script>
	export default {
		props: {
			labelList: Array,
			activeIndex: Number
		},
		watch: {
			activeIndex(index) {
				this.currentIndex = `item${index}`
			}
		},
		data() {
			return {
				currentIndex: ''
			}
		},
		methods: {
			// 跳转到标签管理页面
			async goLabelAdmin() {
				// 检测是否登录
				await this.checkedisLogin()
				uni.navigateTo({
					url: "/pages/labelAdmin/labelAdmin"
				})
			},
			navClickFn(index) {
				this.$emit('changeCurrentIndex', index)
			}
		},
	};
</script>

<style lang="scss">
	@import "./css/TabBar.scss";
</style>
