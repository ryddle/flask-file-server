import { URLJoin, secondsToHHMMSS, median } from './mediaplayer_utils.js';
import AudioMotionAnalyzer from './audioMotion-analyzer.js';
import { Playlist, MediaElement } from './mediaplayer_playlist.js';
import { build_play_list_ul, build_play_list, build_lcdisplay, build_pl_info, build_loader } from './mediaplayer_builders.js';
import XverticalSlider from './xvertical-slider.js';
import XVirtualLedDisplay from './xvirtualleddisplay.js';

const videoMimeTypes = ['video/mp4', 'video/m4v', 'video/webm', 'video/ogg', 'video/x-matroska', 'video/avi'];
const audioMimeTypes = ['audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm'];


let currentMediaElement = null;
let mediaControls = document.getElementById('media-controls');
let source_title = mediaList[0].sources[0].filename;

$(document).ready(function () {
  audioElement.addEventListener("timeupdate", (event) => {
    document.getElementById('player_progress').value = audioElement.currentTime;
    if (time_mode == "playing") {
      document.getElementById('player_timer').innerText = secondsToHHMMSS(audioElement.currentTime) + '/' + secondsToHHMMSS(audioElement.duration);
    } else if (time_mode == "remaining") {
      document.getElementById('player_timer').innerText = secondsToHHMMSS(audioElement.duration - audioElement.currentTime) + '/' + secondsToHHMMSS(audioElement.duration);
    }
    updateParagraph();
  });

  audioElement.addEventListener("playing", (event) => {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
  });

  audioElement.addEventListener("pause", (event) => {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
  });

  audioElement.addEventListener("ended", (event) => {
    console.log(window.custom_lyrics_ts);
  });

  videoElement.addEventListener("timeupdate", (event) => {
    document.getElementById('player_progress').value = videoElement.currentTime;
    if (time_mode == "playing") {
      document.getElementById('player_timer').innerText = secondsToHHMMSS(videoElement.currentTime) + '/' + secondsToHHMMSS(videoElement.duration);
    } else if (time_mode == "remaining") {
      document.getElementById('player_timer').innerText = secondsToHHMMSS(videoElement.duration - videoElement.currentTime) + '/' + secondsToHHMMSS(videoElement.duration);
    }
  });

  videoElement.addEventListener("playing", (event) => {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
  });

  videoElement.addEventListener("pause", (event) => {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
  });

});

//////////////////////////////////// VIDEO VIEWER /////////////////////////////////////////////
const videoPanel = document.getElementById('video-panel');
const videoContainer = document.getElementById('video_container');
let videoElement = document.createElement("video");
if (mediaList.length > 0) {
  //video.setAttribute("src", "nameOfFile.ogg");
  if (videoMimeTypes.includes(mediaList[0].sources[0].type)) {
    videoElement.src = mediaList[0].sources[0].src;
  }
}
videoElement.controls = true;
videoElement.crossOrigin = 'anonymous';
videoElement.style.display = 'none';
videoElement.style.maxWidth = '100%';
videoElement.style.width = '100%';
videoElement.style.maxHeight = 'calc(100vh - 210px)';
videoElement.onloadeddata = () => {
  if (currentMediaElement.localName != "video") {
    return;
  }
  window.isPlayingVideo = true;
  document.getElementById('player_progress').max = videoElement.duration;
  document.getElementById('player_timer').innerText = secondsToHHMMSS(videoElement.currentTime) + '/' + secondsToHHMMSS(videoElement.duration);

  source_title = playlist.getCurrentItem().sources[0].filename;
  document.title = "Media Player - " + source_title;
};
//videoPanel.appendChild(videoElement); // add it to the DOM
videoContainer.appendChild(videoElement); // add it to the DOM

if (videoMimeTypes.includes(mediaList[0].sources[0].type)) {
  currentMediaElement = videoElement;
  videoElement.style.display = 'block';
  videoPanel.style.display = 'flex';
}

//////////////////////////////////// END VIDEO VIEWER /////////////////////////////////////////

//////////////////////////////////// AUDIO MOTION /////////////////////////////////////////////
const ctx = window.AudioContext || window.webkitAudioContext;
const context = new ctx();

const audioPanel = document.getElementById('audio-panel');
const mediaContainer = document.getElementById('media-container');
// create new <audio> element
let audioElement = (mediaList.length > 0 && audioMimeTypes.includes(mediaList[0].sources[0].type)) ? new Audio(mediaList[0].sources[0].src) : new Audio();
audioElement.controls = true;
audioElement.crossOrigin = 'anonymous';
audioElement.style.display = 'none';

audioElement.onloadeddata = () => {
  if (currentMediaElement.localName != "audio") {
    return;
  }
  window.isPlayingVideo = false;
  document.getElementById('player_progress').max = audioElement.duration;
  document.getElementById('player_timer').innerText = secondsToHHMMSS(audioElement.currentTime) + '/' + secondsToHHMMSS(audioElement.duration);

  source_title = playlist.getCurrentItem().sources[0].filename;
  document.title = "Media Player - " + source_title;

  $.get(URLJoin(location.origin, '/api/getLyrics?title=') + playlist.items_[playlist.getCurrentIndex()].sources[0].filename.substr(playlist.items_[playlist.getCurrentIndex()].sources[0].filename.lastIndexOf("/") + 1) + '&path=' + playlist.items_[playlist.getCurrentIndex()].sources[0].src, function (data) {
    pl_lyrics_loader.style.display = 'none';
    data = JSON.parse(data);
    updateInfoPanel(data);
  })
    .fail(function () {
      const data = { 'error': 'Lyrics not found.' };
      updateInfoPanel(data);
    });
}
mediaContainer.append(audioElement); // add it to the DOM

const eq_container = document.getElementById('eq_container');

if (audioMimeTypes.includes(mediaList[0].sources[0].type)) {
  currentMediaElement = audioElement;
  audioPanel.style.display = 'block';
  eq_container.style.display = 'flex';
}

const sourceNode = context.createMediaElementSource(audioElement);

const filters = [];

// create filters for each desired frequency band
[30, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].forEach((freq, i) => {
  const eq = context.createBiquadFilter();
  eq.frequency.value = freq;
  eq.type = 'peaking';
  eq.gain.value = 0;
  filters.push(eq);

  let eqbandDiv = document.createElement('div');
  eqbandDiv.className = 'eqband';

  let eqbandLabel = document.createElement('label');
  eqbandLabel.style.color = 'var(--primary-color)';
  eqbandLabel.innerHTML = `${freq < 1000 ? freq : freq / 1000 + 'k'}Hz`;
  eqbandDiv.appendChild(eqbandLabel);

  let sliderconfig = {
    container: eqbandDiv,
    value: 0,
    min: -12,
    max: 12,
    step: 1,
    width: 10,
    height: 100,
    invert: false,
    showLabel: false,
    list: 'tickmarks',
    /*dual_ticks: true,*/
    tick_mark_thumb: true,
    color: {
      trackColorBack: '#ffffff',
      trackColorOver: "var(--primary-color)",
      trackBorderColor: '#dddddd',
      thumbColor: "var(--primary-color)",
      thumbBorderColor: "#111111",
      ticksColor: "var(--primary-color)",
      labelColor: "var(--primary-color)"
    },
    callback: changeGain
  }
  let eqbandSlider = new XverticalSlider(sliderconfig);
  eqbandSlider.setAttribute("class", "equalizer");
  eqbandSlider.setAttribute("data-filter", i);
  eqbandSlider.setAttribute("lists", "tickmarks");
  let eqbandOutput = document.createElement('output');
  eqbandOutput.style.color = 'var(--primary-color)';
  eqbandOutput.id = 'gain' + i;
  eqbandOutput.innerHTML = '0 dB';
  eqbandDiv.appendChild(eqbandOutput);

  eq_container.appendChild(eqbandDiv);
});



// connect the source audio node to the first filter
sourceNode.connect(filters[0]);

// connect each filter to the next one
for (let i = 0; i < filters.length - 1; i++) {
  filters[i].connect(filters[i + 1]);
}

// instantiate the analyzer and connect the last filter to it
let audioMotionConfig = {
  source: filters[filters.length - 1],
  gradient: 'chocolate',
  overlay: false,
  showBgColor: true,
  showScaleX: false
};

const audioMotion = new AudioMotionAnalyzer(
  document.getElementById('audio-panel'), audioMotionConfig
);

Object.assign(audioMotionConfig, audioMotionConfigs[audio_motion_preset]);
if (!AudioMotionAnalyzer.GRADIENTS.includes(audioMotionConfig.gradient)) {
  let _new_gradient_ = createGradient();
  let _gradient_name = _new_gradient_[0];
  let _gradient_options = _new_gradient_[1];
  audioMotionConfig.gradient = _gradient_name;
  if (undefined !== audioMotion) {
    audioMotion.registerGradient(_gradient_name, _gradient_options);
    audioMotion.gradient = _gradient_name;
  }
}

function createGradient() {
  let _name = primary_color.replace('(', '_').replace(')', '_').replaceAll(',', '_').replaceAll(' ', '');
  let cap_name = _name.charAt(0).toUpperCase() + _name.slice(1);
  return [_name, {
    bgColor: bg_color,//'#000000',
    colorStops: [primary_color]
  }];
}

function setGradient() {
  let _new_gradient_ = createGradient();
  let _gradient_name = _new_gradient_[0];
  let _gradient_options = _new_gradient_[1];
  if (undefined !== audioMotion) {
    audioMotion.registerGradient(_gradient_name, _gradient_options);
    audioMotion.gradient = _gradient_name;
  }
}

setGradient();

function changeGain(target) {
  const value = parseFloat(target.value),
    nbFilter = target.dataset.filter,
    output = document.querySelector('#gain' + nbFilter);

  filters[nbFilter].gain.value = value;
  output.value = (value > 0 ? '+' : '') + value + ' dB';
}


let current_primary_color = primary_color;
let current_bg_color = bg_color;
document.addEventListener("colorSettingsChange", (event) => {
  if (current_primary_color != primary_color && (current_audiomotion_preset == "default" || current_audiomotion_preset == "mirror")) {
    current_primary_color = primary_color;
    setGradient();
  }
  if (current_bg_color != bg_color) {
    setGradient();
    audioMotion.setCanvasBgColor(bg_color);
  }
});
let current_audiomotion_preset = audio_motion_preset;
document.addEventListener("audioMotionPresetChange", (event) => {
  if (current_audiomotion_preset != audio_motion_preset) {
    current_audiomotion_preset = audio_motion_preset;
    audioMotion.setOptions(audioMotionConfigs[audio_motion_preset]);
    if (current_audiomotion_preset == "default" || current_audiomotion_preset == "mirror") {
      setGradient();
    }
  }
});
//////////////////////////////////// END AUDIO MOTION /////////////////////////////////////////


//////////////////////////////////// PLAYLIST /////////////////////////////////////////////////
// instantiate the playlist
let mediaElementObj = new MediaElement(audioElement, videoElement);
let playlist = Playlist.from(mediaList, mediaElementObj);
window.playlist = playlist;

source_title = (playlist.items_.length > 0) ? playlist.items_[0].sources[0].filename : "";
document.title = "Media Player - " + source_title;

//create playlist html
let playlist_cont = document.getElementById("playlist_cont");
playlist_cont.style.overflow = "hidden";

let play_list = build_play_list_ul();

for (let index = 0; index < playlist.items_.length; index++) {
  const file = playlist.items_[index].sources[0];

  var liObj = build_play_list(file, index, playListItemClicked);

  play_list.appendChild(liObj);
}
playlist_cont.appendChild(play_list);

function playListItemClicked(target) {
  if (videoMimeTypes.includes(target.type)) {
    audioElement.pause();
    currentMediaElement = videoElement;
  } else if (audioMimeTypes.includes(target.type)) {
    videoElement.pause();
    currentMediaElement = audioElement;
  }

  //load playlist
  playlist.loadPlaylistItem(target.index);
  document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
  var liObjs = Array.from(play_list.getElementsByTagName('li'));
  liObjs.forEach(element => {
    element.style.backgroundColor = 'transparent';
    element.style.fontWeight = 'normal';
    element.style.color = "var(--primary-color)";
  });

  target.parentElement.style.backgroundColor = "var(--primary-color)";
  target.parentElement.style.fontWeight = '700';
  target.parentElement.style.color = '#111111';
}

// Playlist controls
var shufflebtn = document.getElementById("shuffle-btn");
var prevtrackbtn = document.getElementById("prev-track-btn");
var backwardbtn = document.getElementById("backward-btn");
var playtrackbtn = document.getElementById("play-track-btn");
var forwardbtn = document.getElementById("forward-btn");
var nexttrackbtn = document.getElementById("next-track-btn");
var repeatbtn = document.getElementById("repeat-btn");

shufflebtn.addEventListener('click', () => playlist.toggleShuffle());
prevtrackbtn.addEventListener('click', () => playlist.loadPlaylistItem(playlist.getPreviousIndex()));
backwardbtn.addEventListener('click', () => currentMediaElement.currentTime = Math.max(0, currentMediaElement.currentTime - 5));
playtrackbtn.addEventListener('click', () => playlist.togglePlay());
forwardbtn.addEventListener('click', () => currentMediaElement.currentTime = Math.min(currentMediaElement.duration, currentMediaElement.currentTime + 5));
nexttrackbtn.addEventListener('click', () => playlist.loadPlaylistItem(playlist.getNextIndex()));
repeatbtn.addEventListener('click', function () {
  playlist.toggleRepeat();
  if (playlist.getRepeatStatus() === 'off') {
    this.className = "btn btn-secondary controls disabled";
    repeatbtn.innerHTML = '<i class="fa fa-solid fa-repeat"></i>';
  } else if (playlist.getRepeatStatus() === 'one') {
    this.className = "btn btn-secondary controls";
    repeatbtn.innerHTML = '<i class="fa fa-solid fa-repeat" style="text-shadow: 0px 0px 10px white;">1</i>';
  } else {
    this.className = "btn btn-secondary controls";
    repeatbtn.innerHTML = '<i class="fa fa-solid fa-repeat" style="text-shadow: 0px 0px 10px white;"></i>';
  }
});

////////////////// DISPLAYS //////////////////
var time_mode = "playing"; // playing, remaining
window.currentDisplay = "led";

// LED Display //
let [lcdDisplayBack, lcdDisplayFront] = build_lcdisplay(playlist, chageTimeMode);

playlist_cont.parentElement.appendChild(lcdDisplayBack);

// Update LCD display
var lcdDisplayTimer = 0;
var lcdDisplayIndex = 0;
if (currentDisplay == "lcd") {
  lcdDisplayBack.style.display = "block";
  lcdDisplayTimer = setInterval(updateLcdDisplay, 400);
}

function updateLcdDisplay() {
  let lcdDisplayTextArray = [" "].concat(source_title.split(""));
  lcdDisplayIndex++;
  lcdDisplayIndex = lcdDisplayIndex % lcdDisplayTextArray.length;
  let lcdDisplayMaxIndex = Math.max(12, lcdDisplayIndex + 12);
  let lcdDisplayText = lcdDisplayTextArray.slice(lcdDisplayIndex, lcdDisplayMaxIndex).join("");
  if (lcdDisplayIndex + 12 >= lcdDisplayTextArray.length) {
    lcdDisplayText += lcdDisplayTextArray.slice(0, (12 - lcdDisplayText.length) % 12).join("");
  }
  if (currentMediaElement.paused) {
    lcdDisplayFront.innerText = "00:00/00:00-" + lcdDisplayText;
    return;
  }
  if (time_mode == "playing") {
    lcdDisplayFront.innerText = secondsToHHMMSS(currentMediaElement.currentTime) + '/' + secondsToHHMMSS(currentMediaElement.duration) + "-" + lcdDisplayText;
  } else if (time_mode == "remaining") {
    lcdDisplayFront.innerText = secondsToHHMMSS(currentMediaElement.duration - currentMediaElement.currentTime) + '/' + secondsToHHMMSS(currentMediaElement.duration) + "-" + lcdDisplayText;
  }
}

// LED Display 2 //
var matrix = document.createElement("div");
matrix.id = "matrix";
matrix.className = "matrix";
matrix.style.display = "none";
playlist_cont.parentElement.appendChild(matrix);
var vledDiplay = new XVirtualLedDisplay(matrix, { callback: chageTimeMode });
// Update LED display 2
vledDiplay.clearM();
vledDiplay.drawText("00:00", 0, -1);
vledDiplay.drawText(source_title, 30, -1);

var vledDisplayTimer = 0;
function updateLedDisplay2() {
  clearInterval(vledDisplayTimer);
  vledDisplayTimer = 0;

  vledDiplay.drawText(source_title, 30, -1);

  vledDisplayTimer = setInterval(vledDisplayClockTimer, 1000);
}

if (currentDisplay == "led") {
  matrix.style.display = 'block';
  vledDiplay.rotate('left', 30);
  updateLedDisplay2();
}

function vledDisplayClockTimer() {
  if (time_mode == "playing") {
    vledDiplay.drawText(secondsToHHMMSS(currentMediaElement.currentTime), 0, 30);
  } else if (time_mode == "remaining") {
    vledDiplay.drawText(secondsToHHMMSS(currentMediaElement.duration - currentMediaElement.currentTime), 0, 30);
  }
}

function chageTimeMode() {
  if (time_mode == "playing") {
    time_mode = "remaining";
  } else if (time_mode == "remaining") {
    time_mode = "playing";
  }
}

document.getElementById('player_timer').addEventListener('click', function () {
  if (time_mode == "playing") {
    time_mode = "remaining";
  } else if (time_mode == "remaining") {
    time_mode = "playing";
  }
});

document.addEventListener("displayPresetChange", function (event) {
  currentDisplay = event.detail;
  if (currentDisplay == "led") {
    clearInterval(lcdDisplayTimer);
    lcdDisplayTimer = 0;
    lcdDisplayBack.style.display = 'none';

    matrix.style.display = 'block';
    vledDiplay.rotate('left', 30);
    updateLedDisplay2();
  } else if (currentDisplay == "lcd") {
    clearInterval(vledDisplayTimer);
    vledDisplayTimer = 0;
    vledDiplay.stop();
    matrix.style.display = 'none';

    lcdDisplayBack.style.display = 'block';
    lcdDisplayTimer = setInterval(updateLcdDisplay, 400);
  }
});

document.addEventListener('change', function () {
  currentMediaElement = mediaElementObj.activeMediaElement;
});

// Add an event listener to the playlist
playlist.addEventListener('playlistitemload', () => {
  if (videoMimeTypes.includes(playlist.getCurrentItem().sources[0].type)) {
    currentMediaElement = videoElement;
    window.isPlayingVideo = true;
    videoElement.style.display = 'block';
    videoPanel.style.display = 'flex';

    audioPanel.style.display = 'none';
    eq_container.style.display = 'none';
    guidomElement.style.display = 'none';
  } else if (audioMimeTypes.includes(playlist.getCurrentItem().sources[0].type)) {
    currentMediaElement = audioElement;
    window.isPlayingVideo = false;
    audioPanel.style.display = 'flex';
    eq_container.style.display = 'flex';
    guidomElement.style.display = 'block';

    videoPanel.style.display = 'none';
    videoElement.style.display = 'none';
  }

  var liItems = document.getElementById('playlist_ul').getElementsByTagName('li');
  for (let index = 0; index < liItems.length; index++) {
    let li = liItems[index];
    if (index == playlist.getCurrentIndex()) {
      li.style.backgroundColor = "var(--primary-color)";
      li.style.color = '#111111';
      li.style.fontWeight = '700';
      li.style.fontWeight = 'bold';
    } else {
      li.style.backgroundColor = 'transparent';
      li.style.fontWeight = 'normal';
      li.style.color = "var(--primary-color)";
    }
  }

  if (audioMimeTypes.includes(playlist.getCurrentItem().sources[0].type)) {
    // Show the loader
    pl_lyrics_loader.style.display = 'block';
    $.get(URLJoin(location.origin, '/api/getLyrics?title=') + playlist.items_[playlist.getCurrentIndex()].sources[0].filename.substr(playlist.items_[playlist.getCurrentIndex()].sources[0].filename.lastIndexOf("/") + 1) + '&path=' + playlist.items_[playlist.getCurrentIndex()].sources[0].src, function (data) {
      pl_lyrics_loader.style.display = 'none';
      data = JSON.parse(data);
      updateInfoPanel(data);
    })
      .fail(function () {
        const data = { 'error': 'Lyrics not found.' };
        updateInfoPanel(data);
      });

  } else {
    source_title = playlist.getCurrentItem().sources[0].filename;
    updateLedDisplay2();
    pl_lyriscontainer.innerText = "";
    pl_info_infocontainer.innerText = "";
  }

});

document.addEventListener("playlistChangeEvent", (event) => {
  playlist.setItems(event.detail);
  playlist.loadPlaylistItem(0);

  play_list.remove();
  play_list = build_play_list_ul();

  for (let index = 0; index < playlist.items_.length; index++) {
    const file = playlist.items_[index].sources[0];

    var liObj = build_play_list(file, index, playListItemClicked);

    play_list.appendChild(liObj);
  }
  playlist_cont.appendChild(play_list);
});

document.getElementById('player_progress').addEventListener('change', (event) => {
  currentMediaElement.currentTime = document.getElementById('player_progress').value;
});

document.getElementById('player_mute').addEventListener('click', () => {
  currentMediaElement.muted = !currentMediaElement.muted;
  if (currentMediaElement.muted) {
    document.getElementById('player_mute').innerHTML = '<i class="fa fa-solid fa-volume-off"></i>';
  } else {
    document.getElementById('player_mute').innerHTML = '<i class="fa fa-solid fa-volume-up"></i>';
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key == " " && window['focusSearchInput'] == false) {
    playlist.togglePlay();
    if (playlist.mediaElement_.activeMediaElement.paused) {
      document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    } else {
      document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
    }
  }
});
//////////////////////////////////// END PLAYLIST /////////////////////////////////////////////////


//////////////////////////////////// PLAYLIST INFO ///////////////////////////////////////////////

// Add a playlist info element to your HTML
let [pl_info, pl_info_controls, pl_info_controls_hidelabel, pl_info_controlBtn, pl_info_controlBtnIcon, pl_info_tabs_cont, pl_info_tab_lyrics,
  pl_info_tab_info, pl_lyriscontainer, pl_info_infocontainer, pl_infocont_imagecont, pl_infocont_image, pl_info_infosonginfocont,
  pl_info_artist_p, pl_info_artist_link, pl_info_song_p, pl_info_song_link, pl_info_release_p, pl_info_release_text, pl_info_release_value] = build_pl_info();

window.custom_lyrics_ts = [];
window.lyrics_ts_textnodes = [];
var __sn = document.createElement("span");
__sn.style.color = "var(--primary-color)";

var __hsn = document.createElement("span");
__hsn.style.color = "white";
__hsn.style.textShadow = "0px 0px 10px black";
__hsn.style.backgroundColor = "var(--primary-color)";
function updateInfoPanel(data) {
  if (data.error) {
    pl_lyriscontainer.innerText = data.error;
    pl_lyrics_loader.style.display = 'none';
  } else {
    var body = data.body;
    var lyrics = data.lyrics;
    lyrics = lyrics.replace(/\d+\s\w+butors/gm, ` `);
    lyrics = lyrics.replace(/Lyrics/gm, `\n\n`);

    lyrics = lyrics.replace(new RegExp("^\s*.*" + body.title), body.title);
    lyrics = lyrics.replace(/\$*\d*You might also like/, "")
    lyrics = lyrics.replace(body.pyongs_count + "Embed", "");

    pl_lyriscontainer.innerText = "";
    pl_lyrics_loader.style.display = 'none';

    pl_lyriscontainer.innerText = lyrics;


    var textNodes = [];
    var walker = document.createTreeWalker(pl_lyriscontainer, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (node.nodeValue.trim() != "" && !node.nodeValue.trim().startsWith('[')) {
        textNodes.push(node);
      }
    }
    for (let index = 0; index < textNodes.length; index++) {
      const node = textNodes[index];
      var newsn = __sn.cloneNode();
      newsn.innerText = node.nodeValue;
      node.replaceWith(newsn);
      newsn.addEventListener('click', (event) => {
        window.custom_lyrics_ts.push(Math.floor(currentMediaElement.currentTime));
        console.log(window.custom_lyrics_ts);
      });
    }
    window.lyrics_ts_textnodes = pl_lyriscontainer.getElementsByTagName('span');
    //window.lyrics_ts_textnodes = textNodes;
    updateParagraph();

    source_title = body['artist_names'] + ' - ' + body['title'];
    updateLedDisplay2();

    pl_infocont_image.src = body.header_image_thumbnail_url;
    pl_info_song_link.innerText = body.title;
    pl_info_song_link.href = body.url;
    pl_info_artist_link.innerText = body.artist_names;
    pl_info_artist_link.href = body.primary_artist.url;
    pl_info_release_value.innerText = body.release_date_for_display;

    if (data.lyrics_ts !== undefined) {
      window.lyrics_ts = data.lyrics_ts;
      window.lyrics_ts_index = 0;
    }
  }
}

function updateParagraph() {
  if (window.lyrics_ts !== undefined && Math.floor(currentMediaElement.currentTime) >= window.lyrics_ts[window.lyrics_ts_index]) {
    let result = window.lyrics_ts_textnodes[window.lyrics_ts_index + 1];
    var stext = __hsn.cloneNode();
    stext.innerHTML = result.innerHTML;
    result.replaceWith(stext);
    window.lyrics_ts_index += 1;
  }
}

// Add a loader element to your HTML
//<!-- https://cssloaders.github.io/ -->
var sheet = window.document.styleSheets[0];
sheet.insertRule('@keyframes rotation {\
  0% {transform: rotate(0deg);}\
  100% {transform: rotate(360deg);}\
}', sheet.cssRules.length);

var pl_lyrics_loader = build_loader();
window.pl_lyrics_loader = pl_lyrics_loader;

// Append the loader to the modal body
pl_info.appendChild(pl_lyrics_loader);

document.getElementById('lyrics').appendChild(pl_info);

document.addEventListener("songInfoChange", (event) => {
  var data = event.detail;
  updateInfoPanel(data);
});
//////////////////////////////////// END PLAYLIST INFO ///////////////////////////////////////////////



//////////////////////////////////// AUDIO  MOTION CONTROLS //////////////////////////////////////////
/* ======== CONTROLS (dat-gui) ======== */
import * as dat from './dat.gui.module.js';

const gui = new dat.GUI({ autoPlace: false, closed: true });

gui.add(audioMotion, 'gradient', ['classic', 'prism', 'orangered', 'rainbow', 'steelblue']);

gui.add(audioMotion, 'mode', {
  'Discrete frequencies': 0,
  '1/24th octave / 240 bands': 1,
  '1/12th octave / 120 bands': 2,
  '1/8th octave / 80 bands': 3,
  '1/6th octave / 60 bands': 4,
  '1/4th octave / 40 bands': 5,
  '1/3rd octave / 30 bands': 6,
  'Half octave / 20 bands': 7,
  'Full octave / 10 bands': 8,
  'Line / Area graph': 10
});

const newFeaturesFolder = gui.addFolder('📢 New in version 4');

newFeaturesFolder.add(audioMotion, 'ansiBands');
newFeaturesFolder.add(audioMotion, 'colorMode', ['bar-index', 'bar-level', 'gradient']);
newFeaturesFolder.add(audioMotion, 'channelLayout', ['single', 'dual-combined', 'dual-horizontal', 'dual-vertical']);

newFeaturesFolder.add(audioMotion, 'gradientLeft', ['classic', 'prism', 'orangered', 'rainbow', 'steelblue']);
newFeaturesFolder.add(audioMotion, 'gradientRight', ['classic', 'prism', 'orangered', 'rainbow', 'steelblue']);

newFeaturesFolder.add(audioMotion, 'frequencyScale', {
  'Bark': 'bark',
  'Linear': 'linear',
  'Logarithmic': 'log',
  'Mel': 'mel'
});
newFeaturesFolder.add(audioMotion, 'linearAmplitude');
newFeaturesFolder.add(audioMotion, 'linearBoost', 1, 5, .2);
newFeaturesFolder.add(audioMotion, 'noteLabels');
newFeaturesFolder.add(audioMotion, 'peakLine');
newFeaturesFolder.add(audioMotion, 'radius', 0, 1, .05);
newFeaturesFolder.add(audioMotion, 'radialInvert');
newFeaturesFolder.add(audioMotion, 'roundBars');
newFeaturesFolder.add(audioMotion, 'trueLeds');
newFeaturesFolder.add(audioMotion, 'weightingFilter', {
  'none': '',
  'A-weighting': 'A',
  'B-weighting': 'B',
  'C-weighting': 'C',
  'D-weighting': 'D',
  'ITU-R 468': '468'
});

const bandsFolder = gui.addFolder('Bands / Graph settings');

bandsFolder.add(audioMotion, 'barSpace', 0, 1, .1);

bandsFolder.add(audioMotion, 'alphaBars');
bandsFolder.add(audioMotion, 'ledBars');
bandsFolder.add(audioMotion, 'lumiBars');
bandsFolder.add(audioMotion, 'outlineBars');
bandsFolder.add(audioMotion, 'fillAlpha', 0, 1, .1);
bandsFolder.add(audioMotion, 'lineWidth', 0, 5, .5);

const radialFolder = gui.addFolder('Radial settings');

radialFolder.add(audioMotion, 'radial');
radialFolder.add(audioMotion, 'spinSpeed', -5, 5, 1);

const reflexFolder = gui.addFolder('Reflex & Mirror settings');

reflexFolder.add(audioMotion, 'mirror', -1, 1, 1);
reflexFolder.add(audioMotion, 'reflexRatio', 0, .9, .1);
reflexFolder.add(audioMotion, 'reflexAlpha', 0, 1, .1);
reflexFolder.add(audioMotion, 'reflexBright', 0, 2, .1);
reflexFolder.add(audioMotion, 'reflexFit');

const switchesFolder = gui.addFolder('Switches');

const switches = ['showBgColor', 'showPeaks', 'showScaleX', 'showScaleY', 'splitGradient', 'loRes', 'showFPS'];

for (let prop of switches)
  switchesFolder.add(audioMotion, prop);

const buttons = {
  //  link: () => window.parent.location = 'https://audiomotion.dev',
  link: () => window.parent.location = 'https://github.com/hvianna/audioMotion-analyzer/tree/develop#readme',
  fullscreen: () => audioMotion.toggleFullscreen(),
}
gui.add(buttons, 'link').name(`v${AudioMotionAnalyzer.version}`);

let guidomElement = gui.domElement;
Object.assign(guidomElement.style, {
  width: '245px',
  position: 'absolute',
  left: 'calc(50% - 400px)',
  top: '18px'
})
document.getElementById('audio-panel').appendChild(guidomElement);

if (currentMediaElement.nodeName == "VIDEO") {
  guidomElement.style.display = 'none';
}
//////////////////////////////////// END AUDIO  MOTION CONTROLS //////////////////////////////////////