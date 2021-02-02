$(function () {
	getUserInfo();
	var layer = layui.layer;
	// 点击按钮，实现退出功能
	$('#btnLogout').on('click', function () {
		// 提示用户是否确认退出
		layer.confirm(
			'确定退出登录？',
			{ icon: 3, title: '提示' },
			function (index) {
				// do something
				// 1.清空本地存储中的token
				localStorage.removeItem('token');
				// 2.重新跳转到登录页面
				location.href = '/login.html';

				// 关闭confirm询问框
				layer.close(index);
			}
		);
	});
});
function getUserInfo() {
	$.ajax({
		method: 'GET',
		url: '/my/userinfo',
		// headers: {
		// 	Authorization: localStorage.getItem('token') || '',
		// },
		success: function (res) {
			console.log(res);
			if (res.status !== 0) {
				return layui.layer.msg('获取用户信息失败!');
			}
			renderAvatar(res.data);
		},
	});
}

// 渲染用户的头像
function renderAvatar(user) {
	// 1.获取用户的名称
	var name = user.nickname || user.username;
	// 2.设置欢迎文本
	$('#welcome').html('欢迎&nbsp;&nbsp;' + name);
	// 3.按需渲染用户的头像
	if (user.user_pic !== null) {
		// 渲染图片头像
		$('.layui-nav-img').attr('src', user.user_pic).show();
		$('.text-avatar').hide();
	} else {
		// 渲染文本头像
		$('.layui-nav-img').hide();
		var first = name[0].toUpperCase(); //字符串转化为大写
		$('.text-avatar').html(first).show();
	}
}
