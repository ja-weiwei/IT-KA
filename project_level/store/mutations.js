export default {
  updateUserInfo(state,userInfo) {
    uni.setStorageSync('userInfo',userInfo); //本地储存的用户信息
    state.userInfo = userInfo;
  },
  // 修改历史记录存储
  setHistory(state,val){
	  let list = state.historyList;
	  if((list.length > 0) && list.findIndex(item => item === val)> -1 ) return
	  list.unshift(val);
	  uni.setStorageSync('historyList',list)
	  state.historyList = list
  },
  // 清空历史搜索记录
  cleanHistory(state){
	  uni.removeStorageSync('historyList')
	  state.historyList  = []
	  uni.showToast({
	  	title:"清空完成",
		icon:"success"
	  })
  },
  // 设置导航栏选项卡
  setLabelList(state,labelList){
	  uni.setStorageSync('labelList',labelList)
	  state.labelList=labelList
  }
}