'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		articleId,
		pageSize = 10,
		page = 1
	} = event;
	
	const list = await db.collection('article')
	.aggregate()
	.match({
		_id:articleId
	})
	.unwind('$comments')
	.project({
		_id:0,
		comments:1
	})
	.replaceRoot({
		newRoot:'$comments'
	})
	.skip(pageSize *(page-1))
	.limit(pageSize)
	.end()
	
	//返回数据给客户端
	return{
		code:0,
		msg:'评论内容获取成功',
		data:list.data
	}
};
