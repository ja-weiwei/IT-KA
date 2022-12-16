'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {
		articleId,
		userId
	} = event;

	// 用户的操作处理
	const userList = await db.collection('user').doc(userId).get();
	// 获取当前用户的点赞字段
	const thumbs_up_article_ids = userList.data[0].thumbs_up_article_ids;
	let returnMsg = '';
	let tempArr = null;
	let thumbsNumber = null;
	
	// 如果thumbs_up_article_ids包含传入的作者id说明已经关注作者了
	if(thumbs_up_article_ids.includes(articleId)){
		// 从thumbs_up_article_ids移除articleId作者id
		tempArr = dbCmd.pull(articleId);
		returnMsg = '您取消了点赞';
		thumbsNumber = -1;
	}else{
		returnMsg = '点赞成功';
		tempArr = dbCmd.addToSet(articleId);
		thumbsNumber = 1;
	}
	// 将处理完的内容进行重新插入更新数据库数据
	await db.collection('user').doc(userId).update({
		thumbs_up_article_ids : tempArr
	})
	
	// 处理文章的点赞数量
	await db.collection('article').doc(articleId).update({
		thumbs_up_count:dbCmd.inc(thumbsNumber)
	})
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:returnMsg
		}
	}
};
