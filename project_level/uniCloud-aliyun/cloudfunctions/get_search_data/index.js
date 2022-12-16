'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	const {
		searchVal
	} = event


	const list = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		.match({
			title: new RegExp(searchVal)
		}) // 根据匹配条件进行数据返回
		.project({
			content: 0 // 本次查询不需要返回文章详情给前端
		})
		.end()
		

	//返回数据给客户端
	return {
		code: 0,
		msg: "数据请求成功",
		data: {
			articleList:list.data,
		},
	}
};
