<template>
  <view class="nav-bar">
    <view class="nav-bar-top">
		<!-- 头部垫片 -->
      <view :style="{height:statusHeight + 'rpx'}"></view>
	  
	  <!-- 当组件作为搜索界面使用的时候，展示回退按钮 -->
	  <view @click="returnArticleList" class="return-icon" :style="{top:statusHeight + 'rpx'}" v-if="isSearch">
		  <uni-icons type="back" size="22" color="#fff"></uni-icons>
	  </view>
	  
      <view @click="goSearchPage"  class="nav-bar-content" :style="{marginRight:marginRight + 'rpx' ,marginLeft:isSearch?'20rpx':'' }">
        <uni-icons class="nav-bar-search-icon" type="search" color="#999"></uni-icons>
        <view v-if="!isSearch" class="nav-bar-search-txt">输入文章标题进行搜索</view>
		<input v-else class="search-input" v-model.trim="searchVal" type="text" placeholder="输入文章标题进行搜索" @confirm="changeInput" confirm-type="search">
	  </view>
    </view>
    <!-- 底部垫片 -->
    <view :style="{height:80 + statusHeight + 'rpx'}"></view>
  </view>
</template>

<script>
export default {
	props:{
		isSearch:{
			type:Boolean,
			default:false
		},
		parentVal:String
	},
  created () {
    /* 初始化获取状态栏高度 */
    this.initStatusBarHeight()
  },
  data () {
    return {
      statusHeight: 40,
      marginRight: 0,
    }
  },
  methods: {
    initStatusBarHeight () {
      const systemInfo = uni.getSystemInfoSync()
      this.statusHeight = systemInfo.statusBarHeight ? systemInfo.statusBarHeight * 2 : 20;
      /* 如果是小程序的换，进行胶囊处理*/
      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.marginRight = menuButtonInfo.width * 2
      this.statusHeight = menuButtonInfo.top * 2
      // #endif
    },
    goSearchPage () {
		if(this.isSearch) return
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },
	// 返回文章列表界面
	returnArticleList(){
	// #ifdef H5
		uni.switchTab({
			url:'/pages/index/index'
		})
	// #endif
		// #ifndef H5
		uni.navigateBack()
		// #endif
	},
	changeInput(){
		// console.log("0000");
		this.$emit("endSearchData")
	},
  },
  computed:{
	  searchVal:{
		  get(){
			  return this.parentVal
		  },
		  set(val){
			this.$emit('updateVal',val)  
			if(!val){
				// console.log("11");
				// 当搜索框没有值则触发endSearchData事件
				this.$emit('endSearchData')
			}
		  }
	  }
  }
}
</script>

<style scoped lang="scss">
@import "./css/NavBar.scss";
</style>