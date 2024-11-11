const URLJoin = (...args) =>
    args
        .join('/')
        .replace(/[\/]+/g, '/')
        .replace(/^(.+):\//, '$1://')
        .replace(/^file:/, 'file:/')
        .replace(/\/(\?|&|#[^!])/g, '$1')
        .replace(/\?/g, '&')
        .replace('&', '?');

// Example: URLJoin('http://www.google.com', 'a', '/b/cd', '?foo=123', '?bar=foo');

//[image,video,audio,source]

function invokeViewer() {
    var modal = $('#viewer-modal');
    var type = modal.data('bs.modal')._config.type;

    switch (type) {
        case 'image':
            imageViewer(modal);
            break;
        case 'video':
            videoViewer(modal);
            break;
        case 'audio':
            audioViewer(modal);
            break;
        case 'doc':
            docViewer(modal);
            break;
        case 'pdf':
            docViewer(modal);
            break;
        case 'source':
            sourceViewer(modal);
            break;
        case 'text':
            textViewer(modal);
            break;
        default:
            defaultViewer(modal);
            break;
    }

}

function invokeViewerShown(e) {
    var modal = $('#viewer-modal');
    var type = modal.data('bs.modal')._config.type;

    switch (type) {
        case 'image':
            imageViewerShown(e, modal);
            break;
        case 'video':
            videoViewerShown(e, modal);
            break;
        case 'audio':
            audioViewerShown(e, modal);
            break;
        case 'source':
            sourceViewerShown(e, modal);
            break;
        default:
            break;
    }
}

function invokeViewerClose(e) {
    if (e.namespace === 'bs.modal') {
        if (window['viewer'] != null) {
            window['viewer'].destroy();
            window['viewer'] = null;
        }

        var video_element = $("#my-videoplayer")[0];
        if (video_element != null) {
            try {
                video_element.pause();
            } catch (error) {
                //do nothing
                console.log(error);
            }
            video_element = null;
        }

        var audio_element = $("#my-audio-player")[0];
        if (audio_element != null) {
            try {
                audio_element.player.pause();
                audio_element.player.dispose();
            } catch (error) {
                //do nothing
            }
            audio_element = null;
            window['audio_player'] = null;
        }

        if (window['iframe'] != null) {
            window['iframe'].remove();
            window['iframe'] = null;
        }

    }
}

function setModalHeader(modal, file_name, file_size) {
    var htmlHeader = '<button type="button" class="close pull-xs-right" data-dismiss="modal" aria-hidden="true">×</button>\
        <h4 class="modal-title text-left" id="file-name">' + file_name + '</h4>\
        <small class="text-muted" id="file-meta">' + file_size + '</small>\
    </div>';
    var modal_header = modal[0].getElementsByClassName('modal-header')[0];
    modal_header.innerHTML = htmlHeader;
}

function setModalFooter(modal, file_name, file_size) {
    var htmlFooter = '<div class="pull-xs-left">\
            <button type="button" class="btn btn-link highlight hidden-xs-up">Apply syntax highlighting</button>\
        </div>\
        <div class="pull-xs-right">\
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
            <div class="btn-group">\
            <a href="' + file_name + '" class="btn btn-primary fullview" id="download-File" download="">Download</a>\
            </div>\
        </div>';
    var modal_footer = modal[0].getElementsByClassName('modal-footer')[0];
    modal_footer.innerHTML = htmlFooter;
}

function defaultViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;

    setModalHeader(modal, file_name, file_size);

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = "unset";
    modal_body.style.minHeight = "unset";
    modal_body.style.backgroundColor = "#fff";
    modal_body.innerHTML = "";

    setModalFooter(modal, file_name, file_size);
}

function sourceViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

   /*  if (file_name.indexOf(".js") != -1) {
        defaultViewer(modal);
        return;
    } */

    setModalHeader(modal, file_name, file_size);

    $.get(url, function (data) {
        var html = "";
        /* if (file_name.indexOf(".js") != -1) {
            html = "<div id=\"js-code-viewer\" style=\"height: " + (window.innerHeight - 250) + "px ; width: 100%; overflow: scroll;\"></div>";
        } else { */
        html = "<pre style=\"margin: 0px; padding: 0px; overflow: none;\"><code id=\"hlcode\" style=\"height: " + (window.innerHeight - 250) + "px ;overflow: scroll;\">" + data + "</code></pre>";
        //}

        var modal_body = modal[0].getElementsByClassName('modal-body')[0];
        modal_body.style = {};
        modal_body.style.height = window.innerHeight - 200 + "px";
        modal_body.style.minHeight = "unset";
        modal_body.style.backgroundColor = "#fff";
        modal_body.innerHTML = html;

        hljs.highlightAll();
    });

    setModalFooter(modal, file_name, file_size);
}

function sourceViewerShown(e, modal) {
    /* var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    if (file_name.indexOf(".js") != -1) {
        $.get(url, function (data) {
            modal[0].getElementById("js-code-viewer").innerText = data";

            hljs.highlightAll();
        });
    } */
}

function docViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    setModalHeader(modal, file_name, file_size);

    window['iframe'] = document.createElement('iframe');
    window['iframe'].src = "./viewerJSODF/index.html#" + url;
    window['iframe'].style.width = "100%";
    window['iframe'].style.height = "100%";
    window['iframe'].style.minHeight = "800px";

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.backgroundColor = "#fff";
    modal_body.style.height = "800px";
    modal_body.style.minHeight = "unset";

    modal_body.innerHTML = "";
    modal_body.appendChild(window['iframe']);

    setModalFooter(modal, file_name, file_size);
}

function textViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    setModalHeader(modal, file_name, file_size);

    $.get(url, function (data) {
        
        var html = "<textarea id='text-editor' style='width: 100%; height: calc(100vh - 250px);'>" + 
                   data + 
                   "</textarea>";

        var modal_body = modal[0].getElementsByClassName('modal-body')[0];
        modal_body.style = {};
        modal_body.style.height = "calc(100vh - 200px)";
        modal_body.style.minHeight = "unset";
        modal_body.style.backgroundColor = "#fff";
        modal_body.innerHTML = html;
    });

    setModalFooter(modal, file_name, file_size);

    var saveBtn = document.createElement('button');
    saveBtn.setAttribute('type', 'button');
    saveBtn.setAttribute('class', 'btn btn-primary');
    saveBtn.setAttribute('id', 'save-newfile');
    saveBtn.setAttribute('style', 'margin-right: 5px;');
    saveBtn.innerHTML = 'Save';
    saveBtn.addEventListener('click', function () {
        var text = document.getElementById('text-editor').value;
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        var formData = new FormData();
        formData.append("files[]", blob, file_name);
        $.ajax({
            url: location.origin + '/',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log('File posted successfully:', response);
                var modal_footer = modal[0].getElementsByClassName('modal-footer')[0];
                modal_footer.firstChild.innerHTML = "File saved successfully";
                setTimeout(function () {
                    modal_footer.firstChild.innerHTML = "";
                }, 2000);
            },
            error: function (error) {
                console.error('Error posting file:', error);
            }
        });
    });

    $("#download-File").parent().before(saveBtn);
}

function audioViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    setModalHeader(modal, file_name, file_size);

    var htmlBody = '<video id="my-audio-player" class="video-js" width="600" height="400" controls preload="auto" poster="' + location.origin + '/assets/images/default_poster.png"\
     audioOnlyMode="true" audioPosterMode="true" data-setup=\'{ "inactivityTimeout": 0 }\' style="margin-left: auto; margin-right: auto;">\
        <source src="'+ url + '" type="video/mp4"></source>\
        <p class="vjs-no-js">\
            To view this audio please enable JavaScript, and consider upgrading to a web browser that\
            <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\
        </p>\
    </video>';

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = "450px";
    modal_body.style.minHeight = "450px";
    modal_body.style.backgroundColor = "#000";
    modal_body.style.display = 'flex';
    modal_body.innerHTML = htmlBody;

    setModalFooter(modal, file_name, file_size);
}

function audioViewerShown(e, modal) {
    var options = {};

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = "450px";
    modal_body.style.minHeight = "450px";
    modal_body.style.backgroundColor = "#000";
    modal_body.style.display = 'flex';

    window['audio_player'] = videojs('my-audio-player', options, function onPlayerReady() {
        videojs.log('Your player is ready!');

        this.audioOnlyMode("true");
        this.audioPosterMode("true");
        this.audioOnlyMode_ = true;
        this.audioPosterMode_ = true;
        this.audioOnlyCache_ = {
            "playerHeight": "400px",
            "hiddenChildren": []
        };
        this.on('ended', function () {
            videojs.log('Awww...over so soon?!');
        });
    });
}

function videoViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    setModalHeader(modal, file_name, file_size);

    var html = '<video id="my-videoplayer" class="video-js" controls preload="auto" fluid="true" data-setup="{} style="margin-left: auto; margin-right: auto;">\
        <source src="' + url + '" type="video/mp4"></source>\
        <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that\
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\
        </p>\
    </video>';
    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.minHeight = "700px";
    modal_body.style.backgroundColor = "#000";
    modal_body.style.display = 'flex';
    modal_body.innerHTML = html;

    setModalFooter(modal, file_name, file_size);
}

function videoViewerShown(e, modal) {
    var video_element = $("#my-videoplayer")[0];
    video_element.style.width = video_element.videoWidth + 'px';
    video_element.style.height = video_element.videoHeight + 'px';
    video_element.style.marginLeft = 'auto';
    video_element.style.marginRight = 'auto';
}

function imageViewer(modal) {
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    setModalHeader(modal, file_name, file_size);

    //if (document.getElementById("bs_modal_image") == null) {
    var html = '<div id="bs_modal_image_container"><img id="bs_modal_image" data-original="' + url + '" src="' + url + '" alt="Picture" style="max-height:calc(100vh - 280px); max-width: 100%;">';
    for (var i = 0; i < image_files.length; i++) {
        if (url.indexOf(image_files[i]) == -1) {
            html += '<img src="' + image_files[i] + '" alt="Picture" style="display:none">';
        }
    }
    html += '</div>';

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    //modal_body.style.height = "900px";
    modal_body.style.minHeight = "900px";
    modal_body.style.maxHeight = "calc(100vh - 150px)";
    modal_body.style.backgroundColor = "#000";
    modal_body.innerHTML = html;
    //}

    setModalFooter(modal, file_name, file_size);
}

function imageViewerShown(e, modal) {
    var width = document.getElementById("bs_modal_image").clientWidth;
    var height = document.getElementById("bs_modal_image").clientHeight;

    if (e.namespace === 'bs.modal') {
        window['viewer'] = new Viewer(document.getElementById("bs_modal_image_container"));/*, {
            url: 'data-original'
        }*/

        $(window['viewer']).on('hidden', function () {
            window['viewer'] = new Viewer(document.getElementById("bs_modal_image_container"));/*, {
                url: 'data-original'
            }*/
        });
    }
}


function newFileViewer(modal) {
    //var file_name = modal.data('bs.modal')._config.url;
    //var file_size = modal.data('bs.modal')._config.size;
    //var url = URLJoin(location.href, file_name);
    var modal = $('#newfile-modal');
    //setModalHeader(modal, "New file", "");
    var header = modal[0].getElementsByClassName('modal-header')[0];
    header.style = {};
    var label = document.createElement("span");
    label.className = "modal-title";
    label.innerHTML = "New file";
    var editFileNameBtn = document.createElement("button");
    editFileNameBtn.type = "button";
    editFileNameBtn.dataset.toggle = "tooltip";
    editFileNameBtn.dataset.placement = "left";
    editFileNameBtn.title = "Edit";
    editFileNameBtn.innerHTML = "<i class=\"fa fa-pencil\"></i>";
    editFileNameBtn.style.border = '1px solid #ccc';
    editFileNameBtn.style.borderRadius = '4px';
    editFileNameBtn.style.color = '#666';
    editFileNameBtn.style.marginLeft = '50px';
    editFileNameBtn.onclick = function () {
        var input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.style.width = 'calc(100% - 50px)';
        input.value = label.innerText;
        input.onblur = function () {
            label.innerText = input.value;
            header.removeChild(input);
            label.style.display = '';
            editFileNameBtn.style.display = '';
        };

        input.onkeyup = function (e) {
            if (e.keyCode == 13) {
                input.blur();
            }
        };

        label.style.display = 'none';
        editFileNameBtn.style.display = 'none';
        header.appendChild(input);
        input.focus();
    };
    header.appendChild(label);
    header.appendChild(editFileNameBtn);

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = window.innerHeight - 200 + "px";
    modal_body.style.minHeight = "unset";
    modal_body.style.backgroundColor = "#fff";

    var textEditor = document.createElement("textarea");
    textEditor.style.width = "100%";
    textEditor.style.height = "100%";

    modal_body.appendChild(textEditor);

    $("#save-newfile").on("click", function () {
        $("#newfile-modal").modal('hide');
        var file_name = label.innerText + ".txt";
        var file_content = textEditor.value;

        var blob = new Blob([file_content], { type: 'text/plain' });
        var formData = new FormData();
        formData.append("files[]", blob, file_name);
        $.ajax({
            url: location.origin + '/',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log('File posted successfully:', response);
            },
            error: function (error) {
                console.error('Error posting file:', error);
            }
        });
    });
}



function playerViewer() {
    var modal = $('#player-modal');
    var file_name = modal.data('bs.modal')._config.url;
    var file_size = modal.data('bs.modal')._config.size;
    var url = URLJoin(location.href, file_name);

    var htmlHeader = '<button type="button" class="close pull-xs-right" data-dismiss="modal" aria-hidden="true" style="color: #fff; text-shadow: unset; opacity: 1;">×</button>\
        <h4 class="modal-title text-left" id="file-name">' + location.pathname.replaceAll('/', '') + '</h4>\
    </div>';
    var modal_header = modal[0].getElementsByClassName('modal-header')[0];
    modal_header.style.backgroundColor = "#000";
    modal_header.style.color = "#fff";
    modal_header.innerHTML = htmlHeader;

    var htmlBody = '<video id="pl-player" class="video-js vjs-default-skin" controls preload="auto" data-setup="{}" width="640" height="450" style="width: 640px; height: 450px;"></video>';

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = "500px";
    modal_body.style.minHeight = "500px";
    modal_body.style.backgroundColor = "#000";
    modal_body.style.display = 'flex';
    modal_body.innerHTML = htmlBody;

    var htmlFooter = '<div class="pull-xs-left">\
            <a type="button" class="btn btn-primary" style="background-color: chocolate; border-color: chocolate;" href="' + URLJoin(location.origin, '/audioplayer/index.html?path=', window.path) + '" target="_blank"><i class="fa fa-external-link"></i> Open audio player</a>\
        </div>\
        <div class="pull-xs-right">\
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
        </div>';
    var modal_footer = modal[0].getElementsByClassName('modal-footer')[0];
    modal_footer.innerHTML = htmlFooter;
    modal_footer.style.backgroundColor = "#000";
    modal_footer.style.color = "#fff";
}

var pl_player;
var playlistPlugin;
var PlaylistPluginClass;
var playlist;
var pl_lyrics_loader;
function playerViewerShown(e) {
    var modal = $('#player-modal');
    var options = {};

    var modal_body = modal[0].getElementsByClassName('modal-body')[0];
    modal_body.style = {};
    modal_body.style.height = "500px";
    modal_body.style.minHeight = "500px";
    modal_body.style.backgroundColor = "#000";
    modal_body.style.display = 'flex';

    pl_player = videojs('pl-player');

    // Plugin event listeners. All are triggered on the player.
    pl_player.on([
        'playlistchange', 'playlistsorted',
        'beforeplaylistitem', 'playlistitem',
        'playlistadd', 'playlistremove'
    ], (e, data) => {
        videojs.log('player saw "' + e.type + '"', e);
        videojs.log('event data:', data);

        if (e.type != 'beforeplaylistitem') {
            var currentIndex = playlistPlugin.playlist_.currentIndex_;
            var liObjs = Array.from(document.getElementById('playlist_ul').getElementsByTagName('li'));
            for (var i = 0; i < liObjs.length; i++) {
                if (i == currentIndex) {
                    liObjs[i].style.backgroundColor = 'white';
                    liObjs[i].style.fontWeight = '700';
                    //liObjs[i].style.color = "white";
                } else {
                    liObjs[i].style.backgroundColor = 'transparent';
                    liObjs[i].style.fontWeight = 'normal';
                    //liObjs[i].style.color = "chocolate";
                }
            }

            // Show the loader
            pl_lyrics_loader.style.display = 'block';
            $.get(URLJoin(location.origin, '/api/getLyrics?title=', playlist.items_[currentIndex].sources[0].filename), function (data) {
                pl_lyrics_loader.style.display = 'none';
                data = JSON.parse(data);
                if (data.error) {
                    pl_info.innerText = data.error;
                } else {
                    var pl_lyriscontainer = document.getElementById('pl_lyriscontainer');
                    var body = data.body;
                    var lyrics = data.lyrics[0];
                    lyrics = lyrics.replace(/\d+\s\w+butors/gm, ` `);
                    lyrics = lyrics.replace(/Lyrics/gm, `\n\n`);
                    pl_lyriscontainer.innerText = lyrics;
                    document.getElementById('pl-player_html5_api').poster = body.header_image_thumbnail_url;
                }
            });
        }
    });


    // Initialize PlaylistPlugin
    playlistPlugin = pl_player.playlistPlugin(pl_player, {});
    PlaylistPluginClass = videojs.getPlugin('playlistPlugin');

    /* const audioList = [{
        sources: [{ src: 'http://127.0.0.1:8008/Nightwish/1.Nightwish_-_Dark_Chest_Of_Wonders.mp3', type: 'audio/mpeg' }],
        poster: 'http://127.0.0.1:8008/assets/images/default_poster.png'
    }, {
        sources: [{ src: 'http://127.0.0.1:8008/Nightwish/10.Nightwish_-_Kuolema_Tekee_Taiteilijan.mp3', type: 'audio/mpeg' }],
        poster: 'http://127.0.0.1:8008/assets/images/default_poster.png'
    }, {
        sources: [{ src: 'http://127.0.0.1:8008/Nightwish/11.Nightwish_-_Higher_Than_Hope.mp3', type: 'audio/mpeg' }],
        poster: 'http://127.0.0.1:8008/assets/images/default_poster.png'
    }]; */


    var audioList = [];
    for (let index = 0; index < audio_files.length; index++) {
        const file = audio_files[index];

        var track = {};
        var sources = [{ src: URLJoin(location.href, file), type: 'video/mp4', filename: file }];
        var poster = URLJoin(location.origin, '/assets/images/default_poster.png');
        track.sources = sources;
        track.poster = poster;
        audioList.push(track);
    }

    playlist = PlaylistPluginClass.createPlaylistFrom(audioList);

    // Playlist methods
    // playlist.shuffle();
    playlist.enableRepeat();

    // Plugin methods
    playlistPlugin.loadPlaylist(playlist);
    playlistPlugin.loadFirstItem();
    playlistPlugin.setAutoadvanceDelay(0);

    var playlist_cont = document.createElement("div");
    Object.assign(playlist_cont.style, {
        width: "500px",
        height: "450px",
        marginLeft: "20px"
    });
    modal_body.appendChild(playlist_cont);

    var play_list = document.createElement("ul");
    play_list.id = "playlist_ul";
    Object.assign(play_list.style, {
        height: "400px",
        overflowY: "auto",
        color: "chocolate",
        marginBottom: "12px",
        paddingLeft: "0em"
    });

    if (audio_files.length == 0) {
        return;
    }

    for (let index = 0; index < playlist.items_.length; index++) {
        const file = playlist.items_[index].sources[0].filename;

        var liObj = document.createElement("li");
        liObj.style.listStyle = "decimal";
        liObj.style.listStylePosition = 'inside';
        liObj.style.cursor = "pointer";
        liObj.style.paddingLeft = "3px";
        if (index == 0) {
            liObj.style.backgroundColor = 'white';
            liObj.style.fontWeight = '700';
            //liObj.style.color = 'white';
        }

        var aObj = document.createElement("a");
        aObj.href = "javascript:void(0)";
        aObj.innerText = file;
        aObj.index = index;
        aObj.style.color = "chocolate";
        aObj.style.fontWeight = '700';
        aObj.style.textDecoration = 'none';
        aObj.style.cursor = "pointer";
        aObj.addEventListener('click', function () {
            playlistPlugin.loadPlaylistItem(this.index);
            pl_player.play();
            document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
            var liObjs = Array.from(this.parentElement.parentElement.getElementsByTagName('li'));
            liObjs.forEach(element => {
                element.style.backgroundColor = 'transparent';
                element.style.fontWeight = 'normal';
                element.style.color = "chocolate";
            });

            this.parentElement.style.backgroundColor = 'white';
            //this.parentElement.style.color = 'white';
            this.parentElement.style.fontWeight = '700';
        });
        liObj.appendChild(aObj);

        play_list.appendChild(liObj);
    }
    playlist_cont.appendChild(play_list);

    // Playlist controls 
    var playlist_controls = document.createElement("div");
    playlist_controls.className = "btn-group mr-2";
    playlist_controls.role = "group";
    playlist_controls.ariaLabel = "playlist commands";

    var prev_track_btn = document.createElement("button");
    prev_track_btn.type = "button";
    prev_track_btn.id = "prev-track-btn";
    prev_track_btn.className = "btn btn-secondary controls";
    prev_track_btn.innerHTML = '<i class="fa fa-solid fa-backward"></i>';
    prev_track_btn.addEventListener('click', function () {
        playlistPlugin.loadPreviousItem();
        pl_player.play();
        document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    });
    playlist_controls.appendChild(prev_track_btn);

    var play_track_btn = document.createElement("button");
    play_track_btn.type = "button";
    play_track_btn.id = "play-track-btn";
    play_track_btn.className = "btn btn-secondary controls";
    play_track_btn.innerHTML = '<i class="fa fa-solid fa-play"></i>';
    play_track_btn.addEventListener('click', function () {
        var isPaused = pl_player.paused();
        if (isPaused) {
            pl_player.play();
            this.innerHTML = '<i class="fa fa-solid fa-pause"></i>';
        } else {
            pl_player.pause();
            this.innerHTML = '<i class="fa fa-solid fa-play"></i>';
        }
    });
    playlist_controls.appendChild(play_track_btn);

    var next_track_btn = document.createElement("button");
    next_track_btn.type = "button";
    next_track_btn.id = "next-track-btn";
    next_track_btn.className = "btn btn-secondary controls";
    next_track_btn.innerHTML = '<i class="fa fa-solid fa-forward"></i>';
    next_track_btn.addEventListener('click', function () {
        playlistPlugin.loadNextItem();
        pl_player.play();
        document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    });
    playlist_controls.appendChild(next_track_btn);

    var shuffle_btn = document.createElement("button");
    shuffle_btn.type = "button";
    shuffle_btn.id = "shuffle-btn";
    shuffle_btn.className = "btn btn-secondary controls";
    shuffle_btn.innerHTML = '<i class="fa fa-random"></i>';//'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 16px; height: 16px;"><path fill="#000000" d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"></path></svg>';
    shuffle_btn.addEventListener('click', function () {
        playlist.shuffle();
        pl_player.play();
        document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    });
    playlist_controls.appendChild(shuffle_btn);

    playlist_cont.appendChild(playlist_controls);

    modal_body.appendChild(playlist_cont);

    // Add a playlist info element to your HTML
    var pl_info = document.createElement("div");
    pl_info.id = "pl_info";
    Object.assign(pl_info.style, {
        position: "relative",
        width: "400px",
        height: "450px",
        overflow: "auto",
        border: "1px solid #ccc",
        marginLeft: "10px",
        color: 'chocolate',
        padding: "10px",
        fontSize: "12px"
    });

    var pl_lyriscontainer = document.createElement("div");
    pl_lyriscontainer.id = "pl_lyriscontainer";
    Object.assign(pl_lyriscontainer.style, {
        width: "100%",
        height: "450px",
        color: 'chocolate',
        fontSize: "14px"
    });

    pl_info.appendChild(pl_lyriscontainer);

    // Add a loader element to your HTML
    pl_lyrics_loader = document.createElement('div');
    pl_lyrics_loader.innerText = 'Loading...';
    pl_lyrics_loader.style.position = 'absolute';
    pl_lyrics_loader.style.top = '50%';
    pl_lyrics_loader.style.left = '50%';
    pl_lyrics_loader.style.transform = 'translate(-50%, -50%)';
    pl_lyrics_loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    pl_lyrics_loader.style.color = 'white';
    pl_lyrics_loader.style.padding = '10px';
    pl_lyrics_loader.style.borderRadius = '5px';

    // Append the loader to the modal body
    pl_info.appendChild(pl_lyrics_loader);

    modal_body.appendChild(pl_info);
}

function playerViewerClose(e) {
    pl_player.dispose();
}
