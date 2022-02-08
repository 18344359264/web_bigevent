$(function () {
    let layer = layui.layer
    let form = layui.form
    form.verify({
        nakename: function (value) {

            if (value.length > 6) {

                return "昵称长度必须在1~6位！"
            }
        }
    })

    initUserInfo()

    function initUserInfo() {

        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) return layer.msg("获取失败")
                //给表单赋值
                form.val("userInfo", res.data)

            }
        })
    }

    $("#btnReset").on("click", function (e) {
        e.preventDefault()

        initUserInfo()
    })

    $(".layui-form").on("submit", function (e) {
        e.preventDefault()

        $.ajax({
            method: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg("更新用户信息失败")

                layer.msg(res.message)

                window.parent.getUserInfo()
            }
        })
    })
})