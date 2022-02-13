$(function () {

    let layer = layui.layer
    let form = layui.form
    let valueLocal = JSON.parse(localStorage.getItem("data"));
    let id = localStorage.getItem("id")
    let cateId = localStorage.getItem("cate_id")
    let addedit = "add"

    initCate()

    initEditor()
    function initCate() {

        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)


                let htmlStr = template("tpl-cate", res)


                $("[name=cate_id]").empty().append(htmlStr)


                form.render()
            }
        })

    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
        $("#coverFile").on("change", function (e) {

            let file = e.target.files[0]
            if (file.length == 0) return

            let newImgURL = URL.createObjectURL(file)

            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })
    })

    let art_statu = "已发布"
    $("#btnSave2").on("click", function () {

        art_statu = "草稿"

    })

    if (valueLocal && cateId) {
        addedit = "edit"
        $("[name=title]").val(valueLocal.title)
        $("[name=content]").val(valueLocal.content)
        $(".layui-card-header").html("编辑文章")
        $.ajax({
            method: "get",
            url: `/my/article/cates/${cateId}`,
            success: res => {
                let htmlOpt = template("tpl-opt", res.data)

                $("[name=cate_id]").append(htmlOpt)
                form.render()
            }
        })

    }

    // 监听提交事件
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()

        let fd = new FormData($(this)[0])

        fd.append("state", art_statu)

        // 如果本地有ID(根据ID获取文章详细) 则赋值
        if (id) { fd.append("Id", id) }

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)

                publishArticle(fd)
            })

        art_statu = "已发布"
    })

    function publishArticle(fd) {

        $.ajax({
            method: "post",
            url: `/my/article/${addedit}`,
            data: fd,
            contentType: false,
            processData: false,
            success: res => {

                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                addedit = "add"
                localStorage.removeItem("data")
                localStorage.removeItem("id")
                localStorage.removeItem("cate_id")
                location.href = "../article/art_list.html"

            }
        })

    }

})