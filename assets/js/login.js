$(function () {
	// 点击“去注册账号”的链接
	$('#link_reg').on('click', function () {
		$('.login-box').hide();
		$('.reg-box').show();
	});

	// 点击“去登录”的链接
	$('#link_login').on('click', function () {
		$('.login-box').show();
		$('.reg-box').hide();
	});

	// 验证密码框
	var form = layui.form;
	var layer = layui.layer;

	form.verify({
		// 自定义一个pwd校验规则
		pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
		// 校验两次密码是否一致
		repwd: function (value) {
			var pwd = $('.reg-box [name=password]').val();
			if (pwd !== value) {
				return '两次密码不一致';
			}
		},
	});

	// 监听注册表单的提交事件
	$('#form_reg').on('submit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/api/reguser',
			data: $(this).serialize(),
			suceess: function (res) {
				if (res.status !== 0) {
					return layer.msg(res.message);
				}
				layer.msg('注册成功，请登录！', { time: 800 }, function () {
					$('#link_login').click();
				});
			},
		});
	});

	// 监听登录表单的提交事件
	$('#form_login').on('submit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/api/login',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('登录失败！');
				}
				layer.msg('登录成功！', { time: 800 }, function () {
					localStorage.setItem('token', res.token);
					location.href = 'index.html';
				});
			},
		});
	});
});
