'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {
		userId,
		authorId
	} = event;

	const user = await db.collection('user').doc(userId).get();
	// 获取当前用户的关注作者字段
	const authorLikeIds = user.data[0].author_likes_ids;
	let returnMsg = '';
	let author_ids = null;
	
	// 如果authorLikeIds包含传入的作者id说明已经关注作者了
	if(authorLikeIds.includes(authorId)){
		// 从authorLikeIds移除authorId作者id
		author_ids = dbCmd.pull(authorId);
		returnMsg = '取消关注'
	}else{
		returnMsg = '关注作者成功'
		author_ids = dbCmd.addToSet(authorId)
	}

	// 修改更新数据库数据
	await db.collection('user').doc(userId).update({
		author_likes_ids : author_ids
	})
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:returnMsg
		}
	}
};
