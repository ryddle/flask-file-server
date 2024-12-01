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
        var hash = $.base64.encode($("#username").val() + ":" + $("#password").val());
        document.cookie = "username=" + $("#username").val() + ";path=/";
        document.cookie = "auth_cookie=" + hash + ";path=/";
        $("#userlogin").text($("#username").val());
        $('#login-modal').modal('toggle');
        event.preventDefault();
    });

    $("#userlogin").text(getCookie("username") || "Login");

    $('#searchBox').on('change', function () {
        if (this.value.length > 3) {
            $.post("/api/search", { search: $('#searchBox').val(), path: $('#path').val().replace(/\/$/, '') }, function (data) {
                $('#content-results').hide();
                $('#content-footer').hide();
                $('#search-results').show();
                $('#search-footer').show();

                var html = '';
                for (let index = 0; index < data.results.length; index++) {
                    const entry = data.results[index];
                    if (entry.type == 'dir') {
                        html += '<tr>\
                            <td class="text-xs-left " data-sort-value="dir-'+ entry.name.toLowerCase() + '"><i class="fa fa-fw fa-folder " aria-hidden="true"></i>&nbsp;<a href="' + entry.name + '/"><strong>' + entry.name + '</strong></a></td>\
                            <td class="text-xs-right " data-sort-value="-1">&mdash;</td>\
                            <td class="text-xs-right " data-sort-value="'+ entry.mtime + '" title="' + entry.mtime + '">' + entry.mtimehuman + '</td>\
                            <td class="text-xs-right " style="padding: 0px;align-content: center;"><a data-toggle="modal" data-target="#movepath-modal" data-name="'+ entry.name + '"><i class="fa fa-fw fa-share" style="font-size: 18px;"></i></a></td>\
                            <td class="text-xs-right " style="padding: 0px;align-content: center;"><a data-toggle="modal" data-target="#delete-modal" data-name="'+ entry.name + '" data-type="dir"><i class="fa fa-trash" style="font-size: 18px;"></i></a></td>\
                        </tr>';
                    } else if (entry.type == 'file') {

                        html += '<tr>\
                            <td class="text-xs-left " data-sort-value="file-'+ entry.name.toLowerCase() + '"><i class="fa fa-fw ' + entry.icon + ' " aria-hidden="true"></i>&nbsp;\
                            <a ';
                        /* if(!['unknown', 'archive'].includes(entry.mtype)) {
                           html+='data-toggle="modal" data-target="#viewer-modal" data-url="'+entry.name+'" data-type="'+entry.mtype+'" ';
                        } */
                        html += 'href="' + entry.path + '" data-size="' + entry.size + '">' + entry.path.replaceAll('\\', '/') + '/' + entry.name + '</a>\
                            </td>\
                            <td class="text-xs-right " data-sort-value="'+ entry.size + '" title="' + entry.size + ' bytes">' + entry.size + '</td>\
                            <td class="text-xs-right " data-sort-value="'+ entry.mtime + '" title="' + entry.mtime + '">' + entry.mtimehuman + '</td>\
                            <td class="text-xs-right " style="padding: 0px;align-content: center;"><a data-toggle="modal" data-target="#movepath-modal" data-name="'+ entry.name + '"><i class="fa fa-fw fa-share" style="font-size: 18px;"></i></a></td>\
                            <td class="text-xs-right " style="padding: 0px;align-content: center;"><a data-toggle="modal" data-target="#delete-modal" data-name="'+ entry.name + '" data-type="file"><i class="fa fa-trash" style="font-size: 18px;"></i></a></td>\
                        </tr >';
                    }

                    $('#search-results').html(html);
                }
            }, "json");
        }
    });

    $('#close-search').on('click', function () {
        $('#search-results').hide();
        $('#search-footer').hide();
        $('#content-results').show();
        $('#content-footer').show();
        $('#searchBox').val("");
    });

    $('#uploader-modal').on('hidden.bs.modal', function () {
        location.reload();
    });

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
                data = JSON.parse(data);
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
                data = JSON.parse(jqxhr.responseText);
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
        $('#filer_input').prop("jFiler").reset();
    });

    $('#viewer-modal').on('show.bs.modal', function (event) {
        invokeViewer();
    });

    $('#viewer-modal').on('shown.bs.modal', function (e) {
        var data_type = $('#viewer-modal').data('bs.modal')._config.type;
        invokeViewerShown(e);
    });

    $("#viewer-modal").on('hidden.bs.modal', function (e) {
        $(this).data('bs.modal', null);
        invokeViewerClose(e);
    });

    $('#newfile-modal').on('show.bs.modal', function (event) {
        newFileViewer();
    });

    $('#player-modal').on('show.bs.modal', function (event) {
        playerViewer();
    });

    $('#player-modal').on('shown.bs.modal', function (e) {
        playerViewerShown(e);
    });

    $("#player-modal").on('hidden.bs.modal', function (e) {
        $(this).data('bs.modal', null);
        playerViewerClose(e);
    });

    $('#delete-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var name = button.data('name'); // Extract info from data-* attributes
        var type = button.data('type'); // Extract info from data-* attributes
        var modal = $(this);
        modal.find('.modal-title').text('Delete ' + name + ' ' + type);
        modal.find('#del_name').val(name);
        modal.find('#del_type').val(type);
    });

    $('#send-delete').on('click', function (event) {
        var name = $('#del_name').val(); // Extract info from data-* attributes
        var type = $('#del_type').val();
        if (type == 'dir') {
            name = name + '/';
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

    $('#movepath-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var name = button.data('name'); // Extract info from data-* attributes
        var path = window.path;
        var modal = $(this);
        modal.find('.modal-title').text('Move ' + name + ' to');

        document.getElementById('movepath_source').value = (path + name).replace(/^\/+/g, '');
        document.getElementById('movepath_filename').value = name;

        $.ajax({
            url: '/api/getFolderTree',
            type: 'GET',
            success: function (data) {
                document.getElementById('movepath_tree').innerHTML = '';
                renderTree([data], document.getElementById('movepath_tree'), '/', path);
            }
        });
    });

    $('#send-movepath').on('click', function (event) {
        const checkbox = document.getElementById('movepath_tree').querySelectorAll('input[type="checkbox"]:checked')[0];
        var newpath = checkbox.parentElement.path;
        newpath = newpath.replace(/^\/+/g, '');
        const name = document.getElementById('movepath_filename').value;
        const form = document.getElementById('movepath-form');
        document.getElementById('movepath_target').value = newpath + name;
        form.submit();
    });

    $('#renamepath-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var name = button.data('name'); // Extract info from data-* attributes
        var path = window.path;
        var modal = $(this);
        modal.find('.modal-title').text('Rename ' + name + ' to');

        document.getElementById('renamepath_source').value = (path + name).replace(/^\/+/g, '');
        document.getElementById('renamepath_newname').value = name;
        document.getElementById('renamepath_filename').value = name;
    });

    $('#send-renamepath').on('click', function (event) {
        var path = window.path;
        const newname = document.getElementById('renamepath_newname').value;
        const form = document.getElementById('renamepath-form');
        document.getElementById('renamepath_target').value = (path + newname).replace(/^\/+/g, '');
        form.submit();
    });

    $('#send-ytad-videos').on('click', function (event) {
        var loaderFrame = null;
        if($("#ytad-modal").find("#loaderFrame").length == 0) {
            loaderFrame = document.createElement('div');
            loaderFrame.id = 'loaderFrame';
            Object.assign(loaderFrame.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            });

            var loader = document.createElement('div');
            loader.id = 'loader';
            Object.assign(loader.style, {
                border: '16px solid #f3f3f3',
                borderTop: '16px solid #3498db',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                animation: 'spin 2s linear infinite'
            });
            loaderFrame.appendChild(loader);

            $("#ytad-modal").append(loaderFrame);
        }else{
            loaderFrame = document.getElementById("loaderFrame");
        }

        loaderFrame.style.display = 'flex';
    });

    $('#send-ytad-playlist').on('click', function (event) {
        var loaderFrame = null;
        if($("#ytad-modal").find("#loaderFrame").length == 0) {
            loaderFrame = document.createElement('div');
            loaderFrame.id = 'loaderFrame';
            Object.assign(loaderFrame.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            });

            var loader = document.createElement('div');
            loader.id = 'loader';
            Object.assign(loader.style, {
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #3498db',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 2s linear infinite'
            });
            loaderFrame.appendChild(loader);

            $("#ytad-modal").append(loaderFrame);
        }else{
            loaderFrame = document.getElementById("loaderFrame");
        }

        loaderFrame.style.display = 'flex';
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
        document.getElementById("loaderFrame").style.display = 'none';
        location.reload();
    });
    $("#close-ytad-playlist").on("click", function () {
        document.getElementById("loaderFrame").style.display = 'none';
        location.reload();
    });


    $('#download-file').click(function () {
        this.href += '?download=true';
    });

    $('#select-all').click(function () {
        if (this.checked) {
            document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                cb.checked = true;
            });
        } else {
            document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                cb.checked = false;
            });
        }
    });
});


function renderTree(data, parentElement, path, opath) {
    const ul = document.createElement('ul');
    if (path != "/") {
        ul.style.display = "none";
    }
    parentElement.appendChild(ul);

    data.forEach((item) => {
        const li = document.createElement('li');
        const expcontBtn = document.createElement('a');
        expcontBtn.href = 'javascript:void(0)';
        expcontBtn.style.marginRight = '6px';
        const icon = document.createElement('i');
        icon.className = 'fa fa-minus-square';//.fa-plus-square
        expcontBtn.appendChild(icon);
        expcontBtn.icon = icon;
        expcontBtn.onclick = function () {
            var _li = this.parentElement;
            if (_li.children.length > 3) {
                if (_li.children[3].style.display == "") {
                    _li.children[3].style.display = "none";
                    this.icon.className = "fa fa-plus-square";
                } else {
                    _li.children[3].style.display = "";
                    this.icon.className = "fa fa-minus-square";
                }
            }
        };
        li.appendChild(expcontBtn);
        const span = document.createElement('span');
        span.textContent = item.name;
        span.className = item.type;
        li.appendChild(span);
        if (item.type == 'folder') {
            children = [];
            newpath = path.charAt(0) == '/' ? path + item.name + '/' : path + item.name;
            newpath = newpath.replace('//', '/');
            li.path = newpath;
            li.title = newpath;
            span.textContent = newpath;
            const btn = document.createElement('input');
            btn.type = 'checkbox';
            if (newpath == opath) {
                btn.disabled = true;
                btn.checked = false;
            }
            btn.onchange = function () {
                document.getElementById('movepath_tree').querySelectorAll('input[type="checkbox"]').forEach((cb) => {
                    if (this != cb) {
                        cb.checked = false;
                        cb.folderChecked = false;
                    }
                });
            };
            li.appendChild(btn);

        }
        ul.appendChild(li);

        if (item.children && item.children.length > 0) {
            icon.className = 'fa fa-plus-square';
            renderTree(item.children, li, newpath, opath);
            //renderTree(item.children, li, newpath);
        }
    });
}
