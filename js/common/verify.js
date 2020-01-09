
//表单验证
layui.use(['form', 'layer'], function() {
				// var  $ = layui.jquery;
				var form = layui.form,
					layer = layui.layer;
				//自定义验证规则
				form.verify({
					nikename: function(value) {
						if (value.length < 5) {
							return '昵称至少得5个字符啊';
						}
					},
					pass: [/(.+){6,12}$/, '密码必须6到12位'],
					repass: function(value) {
						if ($('#L_pass').val() != $('#L_repass').val()) {
							return '两次密码不一致';
						}
					}
					
				});


			});