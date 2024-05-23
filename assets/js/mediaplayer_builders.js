const build_play_list_ul = function () {
    let play_list = document.createElement("ul");
    play_list.id = "playlist_ul";
    Object.assign(play_list.style, {
        height: 'calc(100vh - 245px)',
        overflowY: 'auto',
        color: 'var(--primary-color)',
        marginBottom: '12px',
        padding: '5px'
    });
    return play_list;
}


const build_play_list = function (file, index, callback_) {
    let liObj = document.createElement("li");
    liObj.style.listStyle = "decimal";
    liObj.style.listStylePosition = 'inside';
    liObj.style.cursor = "pointer";
    liObj.style.padding = "3px";
    liObj.style.fontSize = "14px";
    liObj.style.marginBottom = "3px";
    if (index == 0) {
        liObj.style.backgroundColor = "var(--primary-color)";
        liObj.style.color = "var(--bg-comp-color)";
        liObj.style.fontWeight = '700';
    } else {
        liObj.style.backgroundColor = 'transparent';
        liObj.style.fontWeight = 'normal';
        liObj.style.color = "var(--primary-color)";
    }

    let aObj = document.createElement("a");
    aObj.href = "javascript:void(0)";
    aObj.innerText = file.filename;
    aObj.type = file.type;
    aObj.index = index;
    aObj.style.color = "inherit";
    aObj.style.fontWeight = '700';
    aObj.style.textDecoration = 'none';
    aObj.style.cursor = "pointer";
    aObj.style.fontSize = "14px";
    aObj.addEventListener('click', function () { callback_(this) });
    liObj.appendChild(aObj);

    return liObj;
}

const build_lcdisplay = function (playlist, callback_) {
    let lcdDisplayBack = document.createElement("div");
    Object.assign(lcdDisplayBack.style, {
        height: '60px',
        backgroundColor: "var(--bg-color)",
        fontFamily: 'Digital7',
        fontSize: '56px',
        textIndent: '5px',
        color: '#888',
        display: 'none',
    });
    lcdDisplayBack.id = "ledDisplayBack";
    lcdDisplayBack.innerText = "888888888888888888888888";

    let lcdDisplayFront = document.createElement("div");
    Object.assign(lcdDisplayFront.style, {
        position: 'relative',
        height: '60px',
        backgroundColor: 'rgba(34, 34, 34, 0.82)',
        boxShadow: 'inset 0px 0px 8px 1px var(--primary-color)',
        top: '-57px',
        left: '1px',
        fontFamily: 'Digital7',
        fontSize: '56px',
        color: 'var(--primary-color)',
        cursor: 'pointer'
    });
    lcdDisplayFront.id = "ledDisplayFront";
    lcdDisplayFront.innerText = "00:00/00:00-" + (playlist.items_.length == 0) ? "" : playlist.items_[playlist.currentIndex_].sources[0].filename.substring(0, 12);
    lcdDisplayFront.time_mode = "playing";
    lcdDisplayFront.onclick = callback_;
    lcdDisplayBack.appendChild(lcdDisplayFront);

    return [lcdDisplayBack, lcdDisplayFront];
}


const build_pl_info = function () {
    let pl_info = document.createElement("div");
    pl_info.id = "pl_info";
    Object.assign(pl_info.style, {
        position: 'relative',
        height: 'calc(100vh - 20px)',
        overflow: 'hidden',
        border: '2px solid ' + "var(--primary-color)",
        /*marginLeft: '10px',*/
        color: "var(--primary-color)",
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: "var(--bg-comp-color)",
    });

    let pl_info_controls = document.createElement("div");
    pl_info_controls.id = "pl_info_controls";
    Object.assign(pl_info_controls.style, {
        height: "18px"
    });

    let pl_info_controls_hidelabel = document.createElement("span");
    pl_info_controls_hidelabel.id = "pl_info_controls_hidelabel";
    pl_info_controls.appendChild(pl_info_controls_hidelabel);

    let pl_info_controlBtn = document.createElement("button");
    pl_info_controlBtn.id = "set-playlist";
    pl_info_controlBtn.className = "btn btn-secondary controls";
    Object.assign(pl_info_controlBtn.style, {
        width: "20px",
        height: "20px",
        padding: "0px",
        margin: "4px",
        float: "right",
        color: "var(--primary-color)"
    });
    pl_info_controlBtn.onclick = function (event) {
        window['showSearchSongDialog'](event);
    };

    let pl_info_controlBtnIcon = document.createElement("i");
    pl_info_controlBtnIcon.className = "fa fa-search";
    pl_info_controlBtn.appendChild(pl_info_controlBtnIcon);
    pl_info_controls.appendChild(pl_info_controlBtn);

    pl_info.appendChild(pl_info_controls);

    let pl_info_tabs_cont = document.createElement("div");
    Object.assign(pl_info_tabs_cont.style, {
        paddingLeft: '10px',
        width: '100%',
        height: '22px',
        display: 'flex',
        borderBottom: '2px solid var(--primary-color)'
    });

    let pl_info_tab_lyrics = document.createElement("div");
    pl_info_tab_lyrics.id = "pl_info_tab_lyrics";
    pl_info_tab_lyrics.className = "pl_info_tab active-tab";
    pl_info_tab_lyrics.innerText = "lyrics";
    pl_info_tab_lyrics.onclick = function () {
        pl_lyriscontainer.style.display = 'block';
        pl_info_tab_lyrics.className = "active-tab";

        pl_info_infocontainer.style.display = 'none';
        pl_info_tab_info.className = "inactive-tab";
    };
    pl_info_tabs_cont.appendChild(pl_info_tab_lyrics);

    let pl_info_tab_info = document.createElement("div");
    pl_info_tab_info.id = "pl_info_tab_info";
    pl_info_tab_info.className = "inactive-tab";
    pl_info_tab_info.innerText = "info";
    pl_info_tab_info.onclick = function () {
        pl_lyriscontainer.style.display = 'none';
        pl_info_tab_lyrics.className = "inactive-tab";

        pl_info_infocontainer.style.display = 'block';
        pl_info_tab_info.className = "active-tab";
    }
    pl_info_tabs_cont.appendChild(pl_info_tab_info);

    pl_info.appendChild(pl_info_tabs_cont);


    let pl_lyriscontainer = document.createElement("div");
    pl_lyriscontainer.id = "pl_lyriscontainer";
    Object.assign(pl_lyriscontainer.style, {
        overflow: "auto",
        padding: "10px",
        width: "100%",
        paddingBottom: "150px",
        height: "calc(-90px + 100vh)",
        color: "var(--primary-color)",
        fontSize: "14px"
    });

    pl_info.appendChild(pl_lyriscontainer);

    let pl_info_infocontainer = document.createElement("div");
    pl_info_infocontainer.id = "pl_info_infocontainer";
    Object.assign(pl_info_infocontainer.style, {
        width: "100%",
        color: "var(--primary-color)",
        fontSize: "14px",
        display: "none",
        padding: "10px"
    });

    let pl_infocont_imagecont = document.createElement("div");
    pl_infocont_imagecont.className = "song-image";

    let pl_infocont_image = document.createElement("img");
    pl_infocont_image.src = "";
    pl_infocont_imagecont.appendChild(pl_infocont_image);
    pl_info_infocontainer.appendChild(pl_infocont_imagecont);

    let pl_info_infosonginfocont = document.createElement("div");
    pl_info_infosonginfocont.className = "song-info";

    let pl_info_artist_p = document.createElement("p");

    let pl_info_artist_text = document.createElement("b");
    pl_info_artist_text.innerText = "Artist: ";
    pl_info_artist_p.appendChild(pl_info_artist_text);

    let pl_info_artist_link = document.createElement("a");
    pl_info_artist_link.style.color = 'white';
    pl_info_artist_link.href = "";
    pl_info_artist_link.target = "_blank";
    pl_info_artist_link.innerText = "";

    pl_info_artist_p.appendChild(pl_info_artist_link);

    pl_info_infosonginfocont.appendChild(pl_info_artist_p);

    let pl_info_song_p = document.createElement("p");

    let pl_info_song_text = document.createElement("b");
    pl_info_song_text.innerText = "Song: ";
    pl_info_song_p.appendChild(pl_info_song_text);

    let pl_info_song_link = document.createElement("a");
    pl_info_song_link.style.color = 'white';
    pl_info_song_link.href = "";
    pl_info_song_link.target = "_blank";
    pl_info_song_link.innerText = "";

    pl_info_song_p.appendChild(pl_info_song_link);

    pl_info_infosonginfocont.appendChild(pl_info_song_p);

    let pl_info_release_p = document.createElement("p");

    let pl_info_release_text = document.createElement("b");
    pl_info_release_text.innerText = "Release Date: ";
    pl_info_release_p.appendChild(pl_info_release_text);

    let pl_info_release_value = document.createElement("span");
    pl_info_release_value.style.color = 'white';
    pl_info_release_value.innerText = "";
    pl_info_release_p.appendChild(pl_info_release_value);

    pl_info_infosonginfocont.appendChild(pl_info_release_p);

    pl_info_infocontainer.appendChild(pl_info_infosonginfocont);

    pl_info.appendChild(pl_info_infocontainer);

    return [pl_info, pl_info_controls, pl_info_controls_hidelabel, pl_info_controlBtn, pl_info_controlBtnIcon, pl_info_tabs_cont, pl_info_tab_lyrics,
        pl_info_tab_info, pl_lyriscontainer, pl_info_infocontainer, pl_infocont_imagecont, pl_infocont_image, pl_info_infosonginfocont,
        pl_info_artist_p, pl_info_artist_link, pl_info_song_p, pl_info_song_link, pl_info_release_p, pl_info_release_text, pl_info_release_value];
}

const build_loader = () => {
    let pl_lyrics_loader = document.createElement('span');
    pl_lyrics_loader.style.position = 'absolute';
    pl_lyrics_loader.style.top = '50%';
    pl_lyrics_loader.style.left = '50%';
    pl_lyrics_loader.style.width = '48px';
    pl_lyrics_loader.style.height = '48px';
    pl_lyrics_loader.style.border = '5px solid';
    pl_lyrics_loader.style.borderColor = 'var(--primary-color) transparent';
    pl_lyrics_loader.style.borderRadius = '50%';
    pl_lyrics_loader.style.display = 'none';
    pl_lyrics_loader.style.boxSizing = 'border-box';
    pl_lyrics_loader.style.animation = 'rotation 1s linear infinite';

    return pl_lyrics_loader;
}

export { build_play_list_ul, build_play_list, build_lcdisplay, build_pl_info, build_loader };