$(function () {
	var layer = layui.layer;
	var form = layui.form;
	var laypage = layui.laypage;

	// 定义美化时间格式的过滤器
	template.defaults.imports.dataFormat = function (date) {
		const dt = new Date(date);
		var y = dt.getFullYear();
		var m = dt.getMonth() + 1;
		var d = dt.getDate();
		var hh = dt.getHours();
		var mm = dt.getMinutes();
		var ss = dt.getSeconds();
		return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss;
	};
	// 定义补零的函数
	function padZero(n) {
		return n > 9 ? n : '0' + n;
	}

	var q = {
		pagenum: 1,
		pagesize: 3,
		cate_id: '',
		state: '',
	};
	initTable();
	initCate();

	function initTable() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: q,
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取文章列表失败！');
				}
				// 使用模板引擎渲染页面的数据
				var htmlStr = template('tpl-table', res);
				$('tbody').html(htmlStr);
				// 调用渲染分页的方法
				renderPage(res.total);
			},
		});
	}

	function initCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('获取分类数据失败！');
				}

				var htmlStr = template('tpl-cate', res);
				$('[name=cate_id]').html(htmlStr);
				form.render();
			},
		});
	}

	// 筛选功能
	$('#form-search').on('submit', function (e) {
		e.preventDefault();

		var cate_id = $('[name=cate_id]').val();
		var state = $('[name=state]').val();

		q.cate_id = cate_id;
		q.state = state;

		initTable();
	});

	//定义渲染分页的方法
	function renderPage(total) {
		// console.log(total);
		laypage.render({
			elem: 'pageBox',
			count: total,
			limit: q.pagesize,
			curr: q.pagenum,
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
			limits: [2, 3, 5, 10],
			// 分页切换时 触发jump回调
			jump: function (obj, first) {
				console.log(first);
				console.log(obj.curr);
				q.pagenum = obj.curr;
				q.pagesize = obj.limit;
				if (!first) {
					initTable();
				}
			},
		});
	}

	// 删除文章
	$('tbody').on('click', '.btn-delete', function () {
		var len = $('.btn-delete').length;
		var id = $(this).attr('data-id');
		layer.confirm(
			'确认删除？',
			{ icon: 3, title: '提示' },
			function (index) {
				$.ajax({
					method: 'GET',
					url: '/my/article/delete/' + id,
					success: function (res) {
						if (res.status !== 0) {
							return layer.msg('删除文章失败！');
						}
						layer.msg('删除文章成功！');
						if (len === 1) {
							q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
						}
						initTable();
					},
				});
				layer.close(index);
			}
		);
	});

	// 编辑文章？
	var indexEdit = null;
	$('tbody').on('click', '.btn-edit', function () {
		// 弹出一个修改文章信息的层
		indexEdit = layer.open({
			type: 1,
			area: ['100%', '100%'],
			title: '修改文章信息',
			content: $('#dialog-edit').html(),
		});
		var id = $(this).attr('data-id');
		$.ajax({
			method: 'GET',
			url: '/my/article/cates/' + id,
			success: function (res) {
				form.val('form-edit', res.data);
			},
		});
	});
	$('body').on('submit', '#form-edit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/article/edit',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) {
					return layer.msg('修改信息失败！');
				}
				layer.msg('修改信息成功！');
				layer.close(indexEdit);
				initArtCateList();
			},
		});
	});
});
