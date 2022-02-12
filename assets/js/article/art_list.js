$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;


    template.defaults.imports.dataFormat = function (date) {

        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = pad(dt.getMonth() + 1)
        let d = pad(dt.getDate())
        let hh = pad(dt.getHours())
        let mm = pad(dt.getMinutes())
        let ss = pad(dt.getSeconds())


        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    function pad(n) {

        return n > 9 ? n : "0" + n
    }

    let qq = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    }

    initTable()

    function initTable(e) {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: qq,
            success: res => {

                if (res.status !== 0) return layer.msg(res.message)

                layer.msg(res.message)


                let htmlStr = template("tpl-table", res)

                $("tbody").empty().append(htmlStr)

                renderPage(res.total)

            }


        })

    }

    initCate()

    function initCate(e) {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: res => {

                if (res.status !== 0) return layer.msg(res.message)

                layer.msg(res.message)

                let htmlStr = template("tpl-cate", res)

                $("[name=cate_id]").empty().append(htmlStr)

                form.render()
            }


        })

    }

    $("#form-search").on("submit", function (e) {
        e.preventDefault()

        let cate_id = $("[name=cate_id]").val()
        let state = $("[name=state]").val()

        qq.cate_id = cate_id
        qq.state = state
        initTable()

    })



    function renderPage(total) {

        laypage.render({

            elem: "pageBox",
            count: total,
            limit: qq.pagesize,
            curr: qq.pagenum,
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            jump: function (obj, first) {

                qq.pagenum = obj.curr
                qq.pagesize = obj.limit

                if (!first) {

                    initTable()
                }

            },

        })

    }


    $("body").on("click", ".deleteBtn", function (e) {
        let len = $(".deleteBtn").length
        let id = $(this).attr("data-id")

        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: "get",
                url: `/my/article/delete/${id}`,
                success: res => {
                    if (res.status !== 0) return layer.msg(res.message)

                    layer.msg(res.message)


                    if (len == 1) {

                        qq.pagenum = qq.pagenum == 1 ? 1 : qq.pagenum - 1
                    }

                    initTable()
                }

            })

        });

    })


    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    $("body").on("click", ".setBtn", function () {
        let id = $(this).attr("data-id")

        $.ajax({
            method: "get",
            url: `/my/article/${id}`,
            success: res => {
                localStorage.setItem("id", id)
                localStorage.setItem("data", JSON.stringify(res.data))
                localStorage.setItem("cate_id", res.data.cate_id)
                location.href = "../article/art_pub.html"
            }
        })




    })





})