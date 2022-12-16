'use strict';
exports.main = async (event, context) => {
  const { phone } = event;
  // 创建一个随机数，返回给前端
  const currentNumber = Math.random().toString().substr(2, 6)
	console.log(currentNumber);
	console.log(phone);
  try {
    const res = await uniCloud.sendSms({
      appid: '__UNI__C774447', // mainfest.json中进行获取
      smsKey: '0551dae486db1ccb9c0151fd814dd028',
      smsSecret: '4ab982d27559ef71a11b587c9daef81e',
      phone,
      templateId: '15994', // 获取的短信模版
      data: {
        code: currentNumber,
        expMinute: '1',
      }
    })
    // 调用成功，请注意这时不代表发送成功
    return {
      code: 0,
      data: {
        mobileCode: currentNumber,
        msg: "请在手机注意查收验证码",
      }
    }
  } catch (err) {
	console.log("1",err.errCode)
	console.log("2",err)
    return {
      code: 1,
      msg: '短信验证码发送失败'
    }
  }
};
