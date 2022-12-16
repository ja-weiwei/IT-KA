<template>
  <view class="list-scroll-container">
    <scroll-view scroll-y="true" class="list-scroll" @scrolltolower="loadmore">
      <view>
        <ListCard @saveSearchHistory="$emit('saveSearchHistory')" :item="item" v-for="item in articleList" :key="item._id"></ListCard>
      </view>
      <uni-load-more v-if="isShowLoadMore && (articleList.length === 0 || articleList.length> 7)" :status="loadData.loading || 'loading'"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "ListItem",
  props: {
    articleList: {
      type: Array,
      default() {
        return []
      }
    },
    loadData: {
      type: Object,
      default () {
        return {
          loading: "loading"
        }
      }
    },
	isShowLoadMore:{
		type:Boolean,
		default:true
	}
  },
  data () {
    return {
    };
  },
  methods: {
    loadmore () {   // 监听触底事件，通知articleLIs组件到底状态
      this.$emit('loadmore')
    }
  },
}
</script>

<style lang="scss">
.list-scroll-container {
  height: 100%;
  .list-scroll {
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
