<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{runTime?`${time}秒后重新获取`:'获取验证码'}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"SendCode",
		// 不支持小程序
		// props:{
		// 	form:Object
		// },
		data() {
			return {
				timeId:null,
				time:60,
				runTime:false
			};
		},
		methods: {
			getForm(){
				// runTime 为ture 说明验证码正在倒计时，则返回
				if(this.runTime) return
				this.$emit('getForm',this._sendCode)
			},
			async _sendCode(form) {
				// 获取form表单 => phone 单独的进行验证
				// console.log(form);
				const {phone} = await form.validateField(['phone'])
				// 获取验证码 调用计时器
				this.timeRunning()
				this.runTime=true
				
				// 发送数据请求云函数
				const {mobileCode,msg} = this.$http.get_code({phone})
				uni.showToast({
					title:msg,
					icon:"none"
				})
				this.$emit('setCurrentCode',mobileCode)
			},
			timeRunning(){
				this.timeId = setInterval(()=>{
					if(this.time ===1) {
						clearInterval(this.timeId)
						this.timeId = null
						this.runTime = false
						this.time = 60
						return
					}
					this.time--; 
				},1000)
			}
		},
		// 离开当前页面则销毁计时器
		beforeDestroy() {
			clearInterval(this.timeId)
			this.timeId = null
			this.runTime = false
			this.time = 60
		}
	}
</script>

<style lang="scss">
	.code-container {
		flex-shrink: 0;
		margin-right: 20rpx;
		.vCode-btn {
			background-color: $base-color;
			color: #FFFFFF;
			padding: 20rpx;
			border-radius: 10rpx;
			opacity: .8;
		}
	}
</style>
