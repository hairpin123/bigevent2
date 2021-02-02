$.ajaxPrefilter(function (options) {
	options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

	// 统一为有权限的接口 设置headers请求头
	if (options.url.indexOf('/my/') !== -1) {
		options.headers = {
			Authorization: localStorage.getItem('token') || '',
		};
	}

	options.complete = function (res) {
		console.log(res);
		if (
			res.responseJSON.status === 1 &&
			res.responseJSON.message === '身份认证失败！'
		) {
			// 1.强制清空token
			localStorage.removeItem('token');
			// 2.强制跳转到登录界面
			location.href = 'login.html';
		}
	};
});
