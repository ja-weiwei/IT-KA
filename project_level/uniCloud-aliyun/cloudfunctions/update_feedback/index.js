'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {

	const {
		userId,
		feedbackImageList,
		content
	} = event;
	
	await db.collection('feedback').add({
		user_id : userId,
		feedbackImageList,
		content
	})

	//返回数据给客户端
	return {
		code:0,
		data:{
			msg:'提交反馈意见成功'
		}
	}
};
