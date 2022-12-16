'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {

	const {
		userId
	} = event;

	let userInfo = await db.collection('user').doc(userId).get()
	//获取关注的作者的数组
	let author_likes_ids = userInfo.data[0].author_likes_ids;

	let list = await db.collection('user')
		.aggregate()
		.addFields({
			is_like: $.in(['$id', author_likes_ids])
		})
		.project({
			// 这两个值不返回
			loginName: false,
			password: false
		})
		.match({
			// 
			is_like: true
		})
		.end()

	//返回数据给客户端
	return {
		code: 0,
		msg: "获取数据成功",
		data: list.data
	}
};
