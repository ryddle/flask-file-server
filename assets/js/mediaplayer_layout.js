// Layout controls
document.getElementById("settingsSBPanel").addEventListener("animationend", (event) => {
  if (event.animationName == 'right-panel-hide') {
    document.getElementById('settingsSBPanel').style.display = 'none';
    document.getElementById('settingsSBPanel').style.right = '-800px';
    document.getElementById('settingsSBPanel').className = 'settingsSBPanel settings-sbpanel';
  }
})

function toggleSettingsPanel() {
  if (document.getElementById('settingsSBPanel').style.display == 'block') {
    document.getElementById('settingsSBPanel').className = 'settingsSBPanel settings-sbpanel rightPanelHide';
  } else {
    hideAllPanels();
    document.getElementById('settingsSBPanel').style.display = 'block';
    document.getElementById('settingsSBPanel').className = 'settingsSBPanel settings-sbpanel rightPanelShow';
  }
}

document.getElementById('playlistSBPanel').addEventListener("animationend", (event) => {
  if (event.animationName == 'right-panel-hide') {
    document.getElementById('playlistSBPanel').style.display = 'none';
    document.getElementById('playlistSBPanel').style.right = '-800px';
    document.getElementById('playlistSBPanel').className = 'playlistSBPanel';
  }
});

function togglePlaylistPanel() {
  if (document.getElementById('playlistSBPanel').style.display == 'block') {
    document.getElementById('playlistSBPanel').className = 'playlistSBPanel rightPanelHide';
  } else {
    hideAllPanels();
    document.getElementById('playlistSBPanel').style.display = 'block';
    document.getElementById('playlistSBPanel').className = 'playlistSBPanel rightPanelShow';
  }
}

document.getElementById('lyricsSBPanel').addEventListener("animationend", (event) => {
  if (event.animationName == 'right-panel-hide') {
    document.getElementById('lyricsSBPanel').style.display = 'none';
    document.getElementById('lyricsSBPanel').style.right = '-800px';
    document.getElementById('lyricsSBPanel').className = 'lyricsSBPanel';
  }
});

function toggleLyricsPanel() {
  if (document.getElementById('lyricsSBPanel').style.display == 'block') {
    document.getElementById('lyricsSBPanel').className = 'lyricsSBPanel rightPanelHide';
  } else {
    hideAllPanels();
    document.getElementById('lyricsSBPanel').style.display = 'block';
    document.getElementById('lyricsSBPanel').className = 'lyricsSBPanel rightPanelShow';
  }
}

document.getElementById('infoSBPanel').addEventListener("animationend", (event) => {
  if (event.animationName == 'right-panel-hide') {
    document.getElementById('infoSBPanel').style.display = 'none';
    document.getElementById('infoSBPanel').style.right = '-800px';
    document.getElementById('infoSBPanel').className = 'infoSBPanel';
  }
});

function toggleInfoPanel() {
  if (document.getElementById('infoSBPanel').style.display == 'block') {
    document.getElementById('infoSBPanel').className = 'infoSBPanel rightPanelHide';
  } else {
    hideAllPanels();
    document.getElementById('infoSBPanel').style.display = 'block';
    document.getElementById('infoSBPanel').className = 'infoSBPanel rightPanelShow';
  }
}

function hideAllPanels() {
  document.getElementById('playlistSBPanel').style.display = 'none';
  document.getElementById('lyricsSBPanel').style.display = 'none';
  document.getElementById('infoSBPanel').style.display = 'none';
}


/* const configLyricsObserver = {
  subtree: false,
  attributeOldValue: true,
};

const callbackLyricsObserver = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "attributes") {
      //alert(`The ${mutation.attributeName} attribute was modified from "${mutation.oldValue}".`);
      let lyricsChangeEvent = new CustomEvent("lyricschange", { detail: mutation });
      document.dispatchEvent(lyricsChangeEvent);
    }
  }
};

const lyricsObserver = new MutationObserver(callbackLyricsObserver);
lyricsObserver.observe(document.getElementById('lyrics'), configLyricsObserver);
document.addEventListener('lyricschange', (event) => {
  let mutation = event.detail;
  if(mutation.oldValue !== "display:'none'"){
    let html = document.getElementById('lyrics').innerHTML;
    document.getElementById('lyrics').innerHTML = '';
    document.getElementById('lyricsSBPanel').innerHTML = html;
  }else{
    let html = document.getElementById('lyricsSBPanel').innerHTML;
    document.getElementById('lyricsSBPanel').innerHTML = '';
    document.getElementById('lyrics').innerHTML = html;
  }
}); */

const videoMimeTypes = ['video/mp4', 'video/m4v', 'video/webm', 'video/ogg', 'video/x-matroska', 'video/avi'];
const audioMimeTypes = ['audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm'];

const scrmodes = {uhd: 1, fhd: 2, hd: 3, sd: 4};
var mediaQueryUHD = window.matchMedia("(min-width: 1921px)");
var mediaQueryFHD = window.matchMedia("(max-width: 1920px)");
var mediaQueryHD = window.matchMedia("(max-width: 1280px)");
var mediaQuerySD = window.matchMedia("(max-width: 900px)");
var mediaQueryLD = window.matchMedia("(max-width: 650px)");

$(document).ready(function () {
  window.isPlayingVideo = (mediaList.length > 0 && videoMimeTypes.includes(mediaList[0].sources[0].type))? true : false;
  window.playlist.addEventListener('playlistitemload', () => {
    if(videoMimeTypes.includes(playlist.getCurrentItem().sources[0].type)) {
      window.isPlayingVideo = true;
    }else if(audioMimeTypes.includes(playlist.getCurrentItem().sources[0].type)) {
      window.isPlayingVideo = false;
    }
    callUpdateLayout();
  });

  callUpdateLayout();
});
mediaQueryUHD.addEventListener("change", function () { mediaQueryListenerUHD(mediaQueryUHD); });
mediaQueryFHD.addEventListener("change", function () { mediaQueryListenerFHD(mediaQueryFHD); });
mediaQueryHD.addEventListener("change", function () { mediaQueryListenerHD(mediaQueryHD); });
mediaQuerySD.addEventListener("change", function () { mediaQueryListenerSD(mediaQuerySD); });
mediaQueryLD.addEventListener("change", function () { mediaQueryListenerLD(mediaQueryLD); });

function mediaQueryListenerUHD(mq) {
  if (mq.matches) {
    updateLayout(scrmodes.uhd);
  }
}

function mediaQueryListenerFHD(mq) {
  if (mq.matches) {
    updateLayout(scrmodes.fhd);
  }
}

function mediaQueryListenerHD(mq) {
  if (mq.matches) {
    updateLayout(scrmodes.hd);
  }
}

function mediaQueryListenerSD(mq) {
  if (mq.matches) {
    updateLayout(scrmodes.sd);
  }
}

function mediaQueryListenerLD(mq) {
  if (mq.matches) {
    updateLayout(scrmodes.ld);
  }
}


/* window.addEventListener('resize', () => {
  if (window.innerWidth < 1280) {
    showLyricsColumn(false);
  } else if (window.innerWidth < 1920) {
    showLyricsColumn(false);
  } else {
    showLyricsColumn(true);
  }
}); */


function callUpdateLayout() {
  if(mediaQueryUHD.matches) {
    updateLayout(scrmodes.uhd);
  }
  if(mediaQueryFHD.matches) {
    updateLayout(scrmodes.fhd);
  }
  if(mediaQueryHD.matches) {
    updateLayout(scrmodes.hd);
  }
  if(mediaQuerySD.matches) {
    updateLayout(scrmodes.sd);
  }
  if(mediaQueryLD.matches) {
    updateLayout(scrmodes.ld);
  }
}

function updateLayout(mode) {
  if (currentDisplay == "led") {
    matrix.style.display = 'block';
  }else{
    lcdDisplayBack.style.display = 'block';
  }
  if (mode == scrmodes.uhd) {
    if(window['videoMode']){
      showLyricsColumn(false);
    }else{
      showLyricsColumn(true);
    }
  }else if (mode == scrmodes.fhd) {
    if (currentDisplay == "led") {
      matrix.style.display = 'block';
    }else{
      lcdDisplayBack.style.display = 'block';
    }
    if(window['videoMode']){
      showLyricsColumn(false);
    }else{
      if(window.isPlayingVideo){
        showLyricsColumn(false);
      }else{
        showLyricsColumn(true);
      }
    }
  }else if (mode == scrmodes.hd) {
    if (currentDisplay == "led") {
      matrix.style.display = 'block';
    }else{
      lcdDisplayBack.style.display = 'block';
    }
    showLyricsColumn(false);
    if(window['videoMode']){
      showPlaylistColumn(false);
      showContentColumn(true);
    }else{
      if(window.isPlayingVideo){
        showPlaylistColumn(false);
        showContentColumn(true);
      }else{
        showPlaylistColumn(true);
        showContentColumn(false);
      }
    }
  }else if (mode == scrmodes.sd) {
    if (currentDisplay == "led") {
      matrix.style.display = 'block';
    }else{
      lcdDisplayBack.style.display = 'block';
    }
    showLyricsColumn(false);
    if(window['videoMode']){
      showPlaylistColumn(false);
      showContentColumn(true);
    }else{
      if(window.isPlayingVideo){
        showPlaylistColumn(false);
        showContentColumn(true);
      }else{
        showPlaylistColumn(true);
        showContentColumn(false);
      }
    }
  }else if (mode == scrmodes.ld) {
    showLyricsColumn(false);
    if(window['videoMode']){
      showPlaylistColumn(false);
      showContentColumn(true);
    }else{
      if(window.isPlayingVideo){
        showPlaylistColumn(false);
        showContentColumn(true);
      }else{
        showPlaylistColumn(true);
        showContentColumn(false);
      }
    }
    document.getElementById('ledDisplayBack').style.display = 'none';
    document.getElementById('matrix').style.display = 'none';
  }
}


function showLyricsColumn(show) {
  if (!show) {
    if (document.getElementById('lyrics').innerHTML != '') {
      let html = document.getElementById('lyrics').innerHTML;
      document.getElementById('lyrics').innerHTML = '';
      document.getElementById('lyricsSBPanel').innerHTML = html;

      let pl_info_tab_lyrics = document.getElementById("pl_info_tab_lyrics");
      let pl_info_tab_info = document.getElementById("pl_info_tab_info");

      let pl_lyriscontainer = document.getElementById("pl_lyriscontainer");
      let pl_info_infocontainer = document.getElementById("pl_info_infocontainer");

      pl_info_tab_lyrics.addEventListener("click", function () {
        pl_lyriscontainer.style.display = 'block';
        pl_info_tab_lyrics.className = "active-tab";

        pl_info_infocontainer.style.display = 'none';
        pl_info_tab_info.className = "inactive-tab";
      });

      pl_info_tab_info.addEventListener("click", function () {
        pl_lyriscontainer.style.display = 'none';
        pl_info_tab_lyrics.className = "inactive-tab";

        pl_info_infocontainer.style.display = 'block';
        pl_info_tab_info.className = "active-tab";
      });
    }
  } else {
    if (document.getElementById('lyrics').innerHTML == '') {
      let html = document.getElementById('lyricsSBPanel').innerHTML;
      document.getElementById('lyricsSBPanel').innerHTML = '';
      document.getElementById('lyrics').innerHTML = html;

      let pl_info_tab_lyrics = document.getElementById("pl_info_tab_lyrics");
      let pl_info_tab_info = document.getElementById("pl_info_tab_info");

      let pl_lyriscontainer = document.getElementById("pl_lyriscontainer");
      let pl_info_infocontainer = document.getElementById("pl_info_infocontainer");

      pl_info_tab_lyrics.addEventListener("click", function () {
        pl_lyriscontainer.style.display = 'block';
        pl_info_tab_lyrics.className = "active-tab";

        pl_info_infocontainer.style.display = 'none';
        pl_info_tab_info.className = "inactive-tab";
      });

      pl_info_tab_info.addEventListener("click", function () {
        pl_lyriscontainer.style.display = 'none';
        pl_info_tab_lyrics.className = "inactive-tab";

        pl_info_infocontainer.style.display = 'block';
        pl_info_tab_info.className = "active-tab";
      });

    }
  }
}

function showPlaylistColumn(show){
  if(show){
    if(document.getElementById('playlist_column').innerHTML == ''){
      document.getElementById('playlist_column').appendChild(document.getElementById('playlist_cont'));
      document.getElementById('playlist_column').appendChild(document.getElementById('playlist_controls_0'));
      document.getElementById('playlist_column').appendChild(document.getElementById('playlist_controls'));
      document.getElementById('playlist_column').appendChild(document.getElementById('matrix'));
      document.getElementById('playlist_column').appendChild(document.getElementById('ledDisplayBack'));
    }
    document.getElementById('playlist_column').style.display = 'block';
    document.getElementById('playlistSBPanel').style.display = 'none';
    document.getElementById('media-controls').style.display = 'none';
  }else{
    if(document.getElementById('playlist_column').innerHTML != ''){
      document.getElementById('playlistSBPanel').appendChild(document.getElementById('playlist_cont'));

      document.getElementById('media-controls').appendChild(document.getElementById('playlist_controls_0'));
      document.getElementById('media-controls').appendChild(document.getElementById('playlist_controls'));
      document.getElementById('media-controls').appendChild(document.getElementById('matrix'));
      document.getElementById('media-controls').appendChild(document.getElementById('ledDisplayBack'));
    }
    document.getElementById('playlist_column').style.display = 'none';
    document.getElementById('media-controls').style.display = 'block';
    document.getElementById('showPlaylistBtn').style.display = 'block';
  }
}


function showContentColumn(show){
  if(show){
    document.getElementById('content').style.display = 'block';
  }else{
    document.getElementById('content').style.display = 'none';
  }
}