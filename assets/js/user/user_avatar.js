$(function () {
	var $image = $('#image');
	const options = {
		aspectRatio: 1,
		preview: '.img-preview',
	};
	$image.cropper(options);

	$('#btnChooseImage').on('click', function () {
		$('#file').click();
	});

	// 为文件选择框绑定change事件
	$('#file').on('change', function (e) {
		var filelist = e.target.files;
		if (filelist.length === 0) {
			return layer.msg('请选择照片！');
		}

		// 1. 拿到用户选择的文件
		var file = e.target.files[0];
		// 2. 将文件，转化为路径
		var imgURL = URL.createObjectURL(file);
		// 3. 重新初始化裁剪区域
		$image
			.cropper('destroy') // 销毁旧的裁剪区域
			.attr('src', imgURL) // 重新设置图片路径
			.cropper(options); // 重新初始化裁剪区域
	});

	$('#btnture').on('click', function () {
		var dataURL = $image
			.cropper('getCroppedCanvas', {
				// 创建一个 Canvas 画布
				width: 100,
				height: 100,
			})
			.toDataURL('image/png');
		$.ajax({
			method: 'POST',
			url: '/my/update/avatar',
			data: {
				avatar: dataURL,
			},
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('更换头像是失败！');
				}
				layer.msg('更换头像成功！');
				window.parent.getUserInfo();
			},
		});
	});
});
