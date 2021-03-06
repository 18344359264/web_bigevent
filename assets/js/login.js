$(function () {
    //  显示注册字样
    $("#link-reg").on("click", function () {

        $(".login-box").hide()
        $(".reg-box").show()

    })

    $("#link-login").on("click", function () {

        $(".login-box").show()
        $(".reg-box").hide()

    })
    //   自定义表达式
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        repwd: function (value) {
            let pwd = $(".reg-box [name=password]").val()

            if (pwd !== value) {
                return "两次密码不一致"
            }
        }

    })
    //    注册请求 
    $("#form_reg").on("submit", function (e) {
        e.preventDefault()

        let data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }

        $.post("/api/reguser", data, function (res) {

            if (res.status !== 0) return layer.msg(res.message)

            layer.msg(res.message)
            $("#link-login").click()
        })

    })

    //   登录请求
    $("#form_login").submit(function (e) {
        e.preventDefault()

        $.ajax({
            url: "/api/login",
            method: "post",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)

                layer.msg(res.message)
                localStorage.setItem("token", res.token)
                location.href = "./index.html"
            }
        })
    })
})