///https://github.com/idleberg/Bootstrap-Listr
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}
$(document).ready(function () {
    $("#login").submit(function (event) {
        var hash = $.base64.encode($("#username").val() + ":" + $("#password").val())
        document.cookie = "username=" + $("#username").val() + ";path=/"
        document.cookie = "auth_cookie=" + hash + ";path=/"
        $("#userlogin").text($("#username").val())
        $('#login-modal').modal('toggle');
        event.preventDefault();
    });
    $("#userlogin").text(getCookie("username") || "Login");
    $('#uploader-modal').on('hidden.bs.modal', function () {
        location.reload();
    })
    $('#filer_input').filer({
        showThumbs: true,
        addMore: true,
        templates: {
            box: '<ul class="jFiler-items-list jFiler-items-default"></ul>',
            item: '<li class="jFiler-item"><div class="jFiler-item-container"><div class="jFiler-item-inner"><div class="jFiler-item-icon pull-left">{{fi-icon}}</div><div class="jFiler-item-info pull-left"><div class="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</div><div class="jFiler-item-others"><span>size: {{fi-size2}}</span><span>type: {{fi-extension}}</span><span class="jFiler-item-status">{{fi-progressBar}}</span></div></div></div></div></li>',
            itemAppend: '<li class="jFiler-item"><div class="jFiler-item-container"><div class="jFiler-item-inner"><div class="jFiler-item-icon pull-left">{{fi-icon}}</div><div class="jFiler-item-info pull-left"><div class="jFiler-item-title">{{fi-name | limitTo:35}}</div><div class="jFiler-item-others"><span>size: {{fi-size2}}</span><span>type: {{fi-extension}}</span><span class="jFiler-item-status"></span></div></div></div></div></li>',
            progressBar: '<div class="bar"></div>',
            itemAppendToEnd: false,
            removeConfirmation: true,
            canvasImage: true,
            _selectors: {
                list: '.jFiler-items-list',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action'
            }
        },
        uploadFile: {
            url: "#",
            data: {},
            type: 'POST',
            enctype: 'multipart/form-data',
            beforeSend: function () { },
            success: function (data, el) {
                var parent = el.find(".jFiler-jProgressBar").parent();
                data = JSON.parse(data)
                if (data.status == 'success') {
                    el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                        $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
                    });
                } else {
                    el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                        $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
                    });
                }
            },
            error: function (el, i, g, h, e, d, jqxhr, c, f) {
                data = JSON.parse(jqxhr.responseText)
                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
                });
            },
            statusCode: null,
            onProgress: null,
            onComplete: null
        },
        captions: {
            button: "Add Files",
            feedback: "Choose files To Upload",
            feedback2: "files were chosen",
            drop: "Drop file here to Upload",
            removeConfirmation: "Are you sure you want to remove this file?",
            errors: {
                filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                filesType: "Only Images are allowed to be uploaded.",
                filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-fileMaxSize}} MB.",
                filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB.",
                folderUpload: "You are not allowed to upload folders."
            }
        }
    });
    $('#close-uploader').click(function () {
        $('#filer_input').prop("jFiler").reset()
    });

    $('#viewer-modal').on('show.bs.modal', function (event) {
        invokeViewer();
    });

    $('#viewer-modal').on('shown.bs.modal', function (e) {
        var data_type = $('#viewer-modal').data('bs.modal')._config.type;
        invokeViewerShown(e);
    })

    $("#viewer-modal").on('hidden.bs.modal', function (e) {
        $(this).data('bs.modal', null);
        invokeViewerClose(e);
    });

    $('#player-modal').on('show.bs.modal', function (event) {
        playerViewer();
    });

    $('#player-modal').on('shown.bs.modal', function (e) {
        playerViewerShown(e);
    })

    $("#player-modal").on('hidden.bs.modal', function (e) {
        $(this).data('bs.modal', null);
        playerViewerClose(e);
    });

    $('#delete-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var name = button.data('name') // Extract info from data-* attributes
        var type = button.data('type') // Extract info from data-* attributes
        var modal = $(this)
        modal.find('.modal-title').text('Delete ' + name + ' ' + type);
        modal.find('#del_name').val(name);
        modal.find('#del_type').val(type);
    });

    $('#send-delete').on('click', function (event) {
        var name = $('#del_name').val() // Extract info from data-* attributes
        var type = $('#del_type').val()
        if (type == 'dir') {
            name = name + '/'
        }
        $.ajax({
            url: $(location).attr("href") + name,
            type: 'delete',
            success: function (result) {
                $('.delete_modal').modal('hide');
                location.reload();
            }
        });

    });

    /* $('#send-ytad-videos').on('click', function (event) {
        var parent = event.target.parentElement;
        var videos_urls = $('#video_urls').val()
        if (videos_urls == '') {
            alert('Please enter videos urls')
            return false;
        }
        var dir_path = $('#dir_path').val()
        $.ajax({
            url: ytad_url + "/api",
            type: 'post',
            beforeSend: function () {
                document.getElementsByTagName("html")[0].style.cursor = "wait";
                $('#send-ytad-videos')[0].style.cursor = "wait";
            },
            data: { videos_urls: videos_urls, dir_path: dir_path },
            success: function (data) {
                document.getElementsByTagName("html")[0].style.cursor = "default";
                $('#send-ytad-videos')[0].style.cursor = "default";
                data = JSON.parse(data)
                if (data.status == 'success') {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
                } else {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
                }
            },
            error: function (data) {
                document.getElementsByTagName("html")[0].style.cursor = "default";
                $('#send-ytad-videos')[0].style.cursor = "default";
                data = JSON.parse(data)
                $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
            }
        });

    });

    $('#send-ytad-playlist').on('click', function (event) {
        var playlist_url = $('#playlist_url').val()
        if (playlist_url == '') {
            alert('Please enter playlist url')
            return false;
        }
        var dir_path = $('#dir_path').val()
        $.ajax({
            url: ytad_url + "/api/playlist",
            data: { playlist_url: playlist_url, dir_path: dir_path },
            type: 'post',
            beforeSend: function () {
                document.getElementsByTagName("html")[0].style.cursor = "wait";
                $('#send-ytad-playlist')[0].style.cursor = "wait";
            },
            success: function (data) {
                document.getElementsByTagName("html")[0].style.cursor = "default";
                $('#send-ytad-playlist')[0].style.cursor = "default";
                data = JSON.parse(data)
                if (data.status == 'success') {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
                } else {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
                }
            },
            error: function (data) {
                document.getElementsByTagName("html")[0].style.cursor = "default";
                $('#send-ytad-playlist')[0].style.cursor = "default";
                data = JSON.parse(data)
                $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Error: " + data.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
            }
        });
    }); */


    $("#close-ytad-videos").on("click", function () {
        location.reload();
    });
    $("#close-ytad-playlist").on("click", function () {
        location.reload();
    });


    $('#download-file').click(function () {
        this.href += '?download=true';
    });
});
