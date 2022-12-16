'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const version = await db.collection('version').get()
	
	//返回数据给客户端
	return {
		code:0,
		data:{
			version:version.data[0].current_version,
			downLoadLinkUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c1da2723-930f-4455-86c1-df51096d1e3e/caee9db5-1291-499b-bf51-fc5bfb95a38e.apk'
		}
	}
};
