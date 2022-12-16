'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {
		article_id
	} = event;

	await db.collection('article').update({
		browse_count: dbCmd.inc(1)
	})

	const articleList = await db.collection('article')
		.aggregate()
		.match({
			_id: article_id
		})
		.project({
			comments: 0
		})
		.end();
	//返回数据给客户端
	return {
		code: 0,
		msg: "文章获取成功",
		data: articleList.data[0]
	}
};
