'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const {
		userId,
		filePath
	} = event;

	// 更新用户头像的操作
	const user = await db.collection('user').doc(userId).get();
	const oldUrl = user.data[0].avatar;


	// 判断一下之前的用户头像是否包含在对象存储里面，如果说有的话，进行一个删除操作
	try {
		await uniCloud.deleteFile({
			fileList: [oldUrl]
		})
	} catch (e) {
		console.log(e);

	}
	// 更新用户头像的操作
	await db.collection('user').doc(userId).update({
		avatar: filePath
	})

	// 更新文章里面的作者头像的操作
	const id = user.data[0].id
	await db.collection('article').where({
		'author.id': id
	}).update({
		'author.avatar': filePath
	})


	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "修改头像成功"
		}
	}
};
