$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        samePwd: function (val) {
            let pwd = $(".layui-form [name=oldPwd]").val()

            if (pwd === val) {
                return "新密码不能和原密码相同"
            }

        },

        repwd: function (value) {
            let pwd = $(".layui-form [name=newPwd]").val()

            if (pwd !== value) {
                return "两次密码不一致"
            }
        }

    })

    function setUserPwd(e) {
        e.preventDefault()

        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {

                if (res.status !== 0) return layer.msg(res.message)

                layer.msg(res.message)

                $(".layui-form")[0].reset()
            }

        })

        // localStorage.removeItem('token')
        // window.parent.location.href = "../login.html"

    }

    $(".layui-form").on("submit", setUserPwd)


})