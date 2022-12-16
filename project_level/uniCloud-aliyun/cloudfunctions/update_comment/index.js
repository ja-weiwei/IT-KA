'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		userId,
		articleId,
		content,
		comment_id = '',
		reply_id = '',
		is_reply = false //判断是否是回复
	} = event;

	// 获取用户信息
	let user = await db.collection('user').doc(userId).get();
	user = user.data[0]

	// 获取文章的数据表
	const article = await db.collection('article').doc(articleId).get();
	const comments = article.data[0].comments;

	let commentObj = {
		comment_id: generatedId(5), //生成一个唯一的ID值
		comment_content: content,
		create_time: Date.now(),
		is_reply, 
		replyArr: [],
		author: {
			author_id: user._id,
			author_name: user.author_name,
			avatar: user.avatar,
			professional: user.professional
		}
	}

	// comment_id为空才执行以下
	if(comment_id === ''){
		commentObj.replyArr=[];
		commentObj = dbCmd.unshift(commentObj)
	}else{
		// 获取当前评论的集合，在这个集合里面找到指定的那一条评论，修改他的replyArr属性
		let commentAuthor = null;
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)
		
		if(is_reply){
			// 指定回复
			commentAuthor = comments[commentIndex].replyArr.find(item => item.comment_id === reply_id).author.author_name
		}else{
		commentAuthor = comments.find(item => item.comment_id === comment_id).author.author_name
			
		}
		
		commentObj.to = commentAuthor
		commentObj = { 
			[commentIndex]:{
				replyArr:dbCmd.unshift(commentObj)
			}
		}
		
	}
	
	// 

	await db.collection('article').doc(articleId).update({
		comments: commentObj
	})

	// 生成ID的方法
	function generatedId(num) {
		return Number(Math.random().toString().substr(3, num) + Date.now()).toString(36)
	}

	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "评论成功"
		}
	}
};
