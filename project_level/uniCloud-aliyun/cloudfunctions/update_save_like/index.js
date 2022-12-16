'use strict';
const db = uniCloud.database()
// 定义修改指令
const dbCmd = db.command
exports.main = async (event, context) => {

	const {
		userId,
		articleId
	} = event

	// 获取用户数据表的集合
	const userInfo = await db.collection('user').doc(userId).get()
	// 当前文章收藏数组
	const articleIds = userInfo.data[0].article_likes_ids
	let articleArr = null
	let returnMsg = null

	// 判断数据表的指定数据里面是否收藏了这篇文章
	if (articleIds.includes(articleId)) {
		// 如果是的话 就删除操作
		articleArr = dbCmd.pull(articleId)
		returnMsg = "取消收藏"

	} else {
		// 如果指定数据里面没有收藏了这篇文章 就添加操作
		articleArr = dbCmd.addToSet(articleId)
		returnMsg = "收藏成功"
	}
	// 修改当前这个指定的用户收藏文章的状态
	await db.collection('user').doc(userId).update({
		article_likes_ids: articleArr
	})
	// 重新获取用户信息
	const newdataUser = await db.collection('user').doc(userId).get()

	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: returnMsg,
			newUserInfo: newdataUser.data[0]
		}
	}
};
