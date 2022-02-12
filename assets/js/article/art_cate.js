$(function () {

    let layer = layui.layer
    let form = layui.form
    initArtCateList()

    function initArtCateList() {

        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {

                if (res.status !== 0) return layer.msg(res.message)

                // layer.msg(res.message)

                let htmlStr = template("tpl", res)

                $(".layui-table tbody").empty().append(htmlStr)

            }

        })


    }

    let indexAdd = null
    let indexEdit = null
    let indexDelete = null
    $("#btnAddCate").on("click", function (e) {

        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ["500px", "250px"],
            content: $("#addCate").html(),
            anim: 3,
        })

    })


    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()

        $.ajax({

            method: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)

                initArtCateList()
                layer.msg(res.message)
                layer.close(indexAdd)
            }
        })

    })


    $("tbody").on("click", ".setBtn", function (e) {

        indexEdit = layer.open({
            type: 1,
            title: "修改文章分类",
            area: ["500px", "250px"],
            content: $("#setCate").html(),
            anim: 3,
        })

        let id = $(this).attr("data-id")

        $.ajax({
            method: "get",
            url: `/my/article/cates/${id}`,
            success: res => {

                layer.msg(res.message)
                form.val("form-edit", res.data)

            }
        })

    })



    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()

        $.ajax({

            method: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)

                initArtCateList()
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        })


    })




    $("tbody").on("click", ".deleteBtn", function (e) {

        let id = $(this).attr("data-id")


        indexDelete = layer.confirm('是否删除该文章', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: "get",
                url: `/ my / article / deletecate / ${id}`,
                success: res => {
                    if (res.status !== 0) return layer.msg(res.message)

                    layer.msg(res.message)
                    initArtCateList()
                }
            })

            layer.close(indexDelete)

        }
        )

    })

})