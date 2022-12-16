'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	const {
		classify,
		page = 1,
		pageSize = 10
	} = event

	let matchObj = {}

	if (classify !== '全部') {
		matchObj = {
			classify
		}
	}

	const list = await db.collection('article')
		.aggregate() // 使用聚合的形式进行数据的获取
		.match(matchObj) // 根据匹配条件进行数据返回
		.project({
			content: 0 // 本次查询不需要返回文章详情给前端
		})
		.skip(pageSize * (page - 1)) // 首页从0开始计算
		.limit(pageSize) // 每页最多返回多少条数据
		.end()
		
	const amount = await db.collection('article').where(matchObj).count()
	
	//返回数据给客户端
	return {
		code: 0,
		msg: "数据请求成功",
		data: {
			articleList:list.data,
			total:amount.total
		},
	}
};
