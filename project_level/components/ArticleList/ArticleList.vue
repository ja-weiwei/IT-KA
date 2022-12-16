<template>
  <swiper class="swiper-container" :current="activeIndex" @change="changeCurrentIndex">
    <swiper-item v-for="(item,index) in labelList" :key="item._id">
      <view class="swiper-item">
        <ListItem :loadData="loadData[index]" :articleList="articleData[index]" @loadmore="watchLoadMore"></ListItem>
      </view>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  props: {
    labelList: Array,
    activeIndex: Number
  },
  created (){
	  this.labelList.length && this._getArticleList(this.activeIndex)
  },
  data () {
    return {
      articleData: {},
      loadData: {},
      page: 1,
      pageSize: 7
    }
  },
  watch: {
    labelList (newVal, oldVal) {
		// console.log(JSON.stringify(newVal),JSON.stringify(oldVal))
		// 收藏文章会导致数据重新请求
		// 处理：当labelList标签旧值等于新值则 返回
		if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
		this.articleData = {};
		this.loadData = {};
		// 请求后端获取文章列表
		this._getArticleList(this.activeIndex)
    },
  },
  methods: {
    //监听屏幕到底事件
    watchLoadMore () {
      // 当现在没有数据的时候，不再进行数据的请求
      // 从新进行数据请求
      if (this.loadData[this.activeIndex].total === this.articleData[this.activeIndex].length) {
        this.loadData[this.activeIndex] = {
          ...this.loadData[this.activeIndex], ...{
            loading: "noMore",
            page: this.loadData[this.activeIndex].page
          }
        }
        this.$forceUpdate()
        return
      }
      this.loadData[this.activeIndex].page++;
      this._getArticleList(this.activeIndex)
    },
    changeCurrentIndex (e) {
      const { current } = e.detail
      this.$emit('changeCurrentIndex', current)
      if (!this.articleData[current] || this.articleData[current].length == 0) {
        this._getArticleList(current)
      }
    },
    // 请求后端获取文章列表
    async _getArticleList (currentIndex) {
      /* 初始化请求判断当前分类是否含有数据，并记录当前的分类页数 */
      if (!this.loadData[currentIndex]) {
        this.loadData[currentIndex] = {
          page: 1,
          loading: 'loading',
          total: 0
        }
      }

      const { articleList, total } = await this.$http.get_article_list({
        classify: this.labelList[currentIndex].name,
        page: this.loadData[currentIndex].page,
        pageSize: this.pageSize
      })


      // 填充数据时改变为追加数据
      let oldList = this.articleData[currentIndex] || []
      oldList.push(...articleList)
      this.loadData[currentIndex].total = total
      this.$set(this.articleData, currentIndex, oldList)
      // this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.swiper-container {
  height: 100%;
  .swiper-item {
    height: 100%;
    overflow: hidden;
  }
}
</style>
