'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	
	const { userId } = event;
	
	let userInfo = await db.collection('user').doc(userId).get()
	//获取收藏的文章的数组
	let article_likes_ids = userInfo.data[0].article_likes_ids; 
	
	let list = await db.collection('article')
	.aggregate()
	.addFields({
		// 如果is_like为true 证明是用户收藏文章
		is_like: $.in(['$_id',article_likes_ids]) //[1,2,3]
	})
	.project({
		content:0
	})
	.match({
		// 
		is_like:true
	})
	.end()
	
	//返回数据给客户端
	return {
		code :0,
		msg:"获取数据成功",
		data:list.data
	}
};
