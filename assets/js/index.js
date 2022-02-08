$(function () {
    let layer = layui.layer

    getUserInfo()

    $("#btnLogout").on("click", function () {
        layer.confirm('是否退出登录', { icon: 3, title: '提示' }, function (index) {

            localStorage.removeItem('token')
            location.href = "./login.html"
        });

    })

})

function getUserInfo() {

    $.ajax({
        method: "get",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            layui.layer.msg(res.message)
            renderAvatar(res.data)

        }

    })
}

function renderAvatar(user) {

    let name = user.nickname || user.username
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)

    if (user.user_pic !== null) {

        $(".text-avatar").hide()
        $(".layui-nav-img").attr("src", user.user_pic).show()
    } else {

        $(".layui-nav-img").hide()
        let first = name[0].toUpperCase()
        $(".text-avatar").html(first).show()
    }
}