<!-- 登录页面 -->
<template>
  <view class="login-container">
    <image src="../../../static/img/login_bg.png" class="banner-bg" mode=""></image>
    <!-- 导航 -->
    <view class="login-nav">
      <view class="nav-item" @click="changFormType('account')" :class="{'active':type==='account'}">
        账号登录
      </view>
      <view class="nav-item" @click="changFormType('mobile')" :class="{'active':type !=='account'}">
        手机登录
      </view>
    </view>
    <!-- 表单部分 -->
    <uni-forms class="form" ref="form" :modelValue="formData">
      <view class="" v-if="type ==='account'">
        <uni-forms-item label="账号" name="loginName">

          <input placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入账号" v-model="formData.loginName" />
        </uni-forms-item>
        <uni-forms-item label="密码" name="password">
          <uni-easyinput :inputBorder="false" placeholder-class="placeholder" class="form-input" type="password" placeholder="请输入密码" v-model="formData.password"></uni-easyinput>
        </uni-forms-item>
      </view>
      <view class="" v-else>
        <uni-forms-item label="手机号" name="phone">
          <input placeholder-class="placeholder" class="form-input" type="number" placeholder="请输入手机号" v-model="formData.phone" />
        </uni-forms-item>
        <uni-forms-item label="验证码" name="vCode">
          <input placeholder-class="placeholder" class="form-input" type="text" placeholder="请输入密码" v-model="formData.vCode" />
          <SendCode @setCurrentCode="returnCode=$event" @getForm="getForm" class="code-component"></SendCode>
        </uni-forms-item>
      </view>

      <button class="login-btn" @click="_userLoginSubmit">立即登录</button>
    </uni-forms>
    <view class="footer-select-container">
      <text>注册</text>
      <text>忘记密码</text>
    </view>
  </view>
</template>

<script>
export default {
	// 页面初次渲染完成
	onReady() {
		this.$refs.form.setRules(this.userRules)
	},
  data () {
    return {
      type: 'account',
      formData: {
        loginName: '',
        password: '',
        phone: "",
        vCode: '',
      },
	  returnCode:''
    }
  },
  methods: {
    async _userLoginSubmit () {
      const res = await this.$refs.form.validate()
      /* 正式向后端发送请求 */
      // console.log(res)
      this._sendUserInfo({
        ...res,
        type: this.type
      })
    },
    /* 切换当前表单类型 */
    changFormType (type) {
      this.type = type;
      this.$refs.form.clearValidate([]) // 清空校验规则
    },
    /* 开始发送数据到后端 */
    async _sendUserInfo (data) {
      const res = await this.$http.user_login(data)
      if (res) {
        this.updateUserInfo(res)
        uni.showToast({
          title: '登录成功', icon: 'none',
        })
        setTimeout(() => { 
			//uni.navigateBack() 
			// 优化刷新页面导致路径历史记录没有
			// #ifdef H5
				uni.switchTab({
					url:'/pages/index/index'
				})
			// #endif
			// #ifndef H5
				uni.navigateBack() 
			// #endif
			}, 1500)
      }
    },
	// 向验证码组件发送form表单
	getForm(cb){
		cb && cb(this.$refs.form)
	},
   
  }
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}
</style>

<style lang="scss" scoped>
@import "./css/login.scss";
</style>
