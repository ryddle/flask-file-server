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

const secondsToHHMMSS = function (sec_num) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = Math.round(sec_num - (hours * 3600) - (minutes * 60));

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return minutes + ':' + seconds;
}

/**
 * This web implements a frequency equalizer
 * connected to audioMotion-analyzer
 *
 * Original equalizer code by Osman Colakoglu
 *
 * For audioMotion-analyzer documentation and
 * more demos, visit https://audiomotion.dev
 */

import AudioMotionAnalyzer from './audioMotion-analyzer.js';
import Playlist from './audioplayer_playlist.js';

const ctx = window.AudioContext || window.webkitAudioContext;
const context = new ctx();

//const mediaElement = document.getElementById('audio');
const audioContainer = document.getElementById('audio-container');
// create new <audio> element
//audioEl = new Audio('https://icecast2.ufpel.edu.br/live');
let mediaElement = new Audio(audioList[0].sources[0].src);
mediaElement.controls = true;
mediaElement.crossOrigin = 'anonymous';
mediaElement.style.display = 'none';
//mediaElement.onloadstart  = () => messageDiv.innerText = 'Buffering audio... please wait...';
mediaElement.onloadeddata = () => {
  //messageDiv.innerText = '';
  document.getElementById('player_progress').max = mediaElement.duration;
  document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  mediaElement.play();
}
audioContainer.append(mediaElement); // add it to the DOM

const sourceNode = context.createMediaElementSource(mediaElement);
const controls = document.getElementById('controls');

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
  eqbandOutput.id = 'gain' + i;
  eqbandOutput.innerHTML = '0 dB';
  eqbandDiv.appendChild(eqbandOutput);

  controls.appendChild(eqbandDiv);
});



// connect the source audio node to the first filter
sourceNode.connect(filters[0]);

// connect each filter to the next one
for (let i = 0; i < filters.length - 1; i++) {
  filters[i].connect(filters[i + 1]);
}

// instantiate the analyzer and connect the last filter to it
let analyzerConfs = [
  {
    source: filters[filters.length - 1],
    gradient: "prism",
    mode: 6,
    barSpace: .4,
    frequencyScale: 'bark',
    ledBars: true,
    linearAmplitude: true,
    linearBoost: 1.6
  },
  {
    source: filters[filters.length - 1],
    gradient: 'chocolate',
  }
]


let audioMotionConfig = {
  source: filters[filters.length - 1],
  gradient: 'chocolate',
};

const audioMotion = new AudioMotionAnalyzer(
  document.getElementById('analyzer'), audioMotionConfig
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
    bgColor: '#000000',
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

function applyColor(color) {
  primary_color = color;
  setCssVar('--primary-color', primary_color);
  setGradient();
}

setGradient();

function changeGain(target) {
  //console.log(event);
  //const target = event.target,
  const value = parseFloat(target.value),
    nbFilter = target.dataset.filter,
    output = document.querySelector('#gain' + nbFilter);

  filters[nbFilter].gain.value = value;
  output.value = (value > 0 ? '+' : '') + value + ' dB';
}

// instantiate the playlist
var playlist = Playlist.from(audioList, mediaElement);
window['playlist'] = playlist;

var song_title = playlist.items_[0].sources[0].filename;

//create playlist html
var playlist_cont = document.getElementById("playlist_cont");

var play_list = document.createElement("ul");
play_list.id = "playlist_ul";
Object.assign(play_list.style, {
  height: "400px",
  overflowY: "auto",
  color: "var(--primary-color)",
  marginBottom: "12px",
  padding: "5px"
});

for (let index = 0; index < playlist.items_.length; index++) {
  const file = playlist.items_[index].sources[0].filename;

  var liObj = document.createElement("li");
  liObj.style.listStyle = "decimal";
  liObj.style.listStylePosition = 'inside';
  liObj.style.cursor = "pointer";
  liObj.style.padding = "3px";
  liObj.style.fontSize = "14px";
  liObj.style.marginBottom = "3px";
  if (index == 0) {
    liObj.style.backgroundColor = "var(--primary-color)";
    liObj.style.color = "#111111";
    liObj.style.fontWeight = '700';
  } else {
    liObj.style.backgroundColor = 'transparent';
    liObj.style.fontWeight = 'normal';
    liObj.style.color = "var(--primary-color)";
  }

  var aObj = document.createElement("a");
  aObj.href = "javascript:void(0)";
  aObj.innerText = file;
  aObj.index = index;
  aObj.style.color = "inherit";
  aObj.style.fontWeight = '700';
  aObj.style.textDecoration = 'none';
  aObj.style.cursor = "pointer";
  aObj.style.fontSize = "14px";
  aObj.addEventListener('click', function () {
    playlist.loadPlaylistItem(this.index);
    //playlist.togglePlay();
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    var liObjs = Array.from(this.parentElement.parentElement.getElementsByTagName('li'));
    liObjs.forEach(element => {
      element.style.backgroundColor = 'transparent';
      element.style.fontWeight = 'normal';
      element.style.color = "var(--primary-color)";
    });

    this.parentElement.style.backgroundColor = "var(--primary-color)";
    this.parentElement.style.fontWeight = '700';
    this.parentElement.style.color = '#111111';
  });
  liObj.appendChild(aObj);

  play_list.appendChild(liObj);
}
playlist_cont.appendChild(play_list);

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
backwardbtn.addEventListener('click', () => mediaElement.currentTime = Math.max(0, mediaElement.currentTime - 5));
playtrackbtn.addEventListener('click', () => playlist.togglePlay());
forwardbtn.addEventListener('click', () => mediaElement.currentTime = Math.min(mediaElement.duration, mediaElement.currentTime + 5));
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
var currentDisplay = "led";

// LED Display //

var ledDisplayBack = document.createElement("div");
Object.assign(ledDisplayBack.style, {
  height: '60px',
  backgroundColor: '#000000',
  fontFamily: 'Digital7',
  fontSize: '56px',
  textIndent: '5px',
  color: '#888',
  display: 'none',
});
ledDisplayBack.id = "ledDisplayBack";
ledDisplayBack.innerText = "888888888888888888888888";

var ledDisplayFront = document.createElement("div");
Object.assign(ledDisplayFront.style, {
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
ledDisplayFront.id = "ledDisplayFront";
ledDisplayFront.innerText = "00:00/00:00-" + playlist.items_[playlist.currentIndex_].sources[0].filename.substring(0, 12);
ledDisplayFront.time_mode = "playing";
ledDisplayFront.onclick = chageTimeMode();
ledDisplayBack.appendChild(ledDisplayFront);

playlist_cont.parentElement.appendChild(ledDisplayBack);


// Update LED display
var ledDisplayTimer = 0;
var ledDisplayIndex = 0;
if (currentDisplay == "lcd") {
  ledDisplayBack.style.display = "block";
  ledDisplayTimer = setInterval(updateLedDisplay, 400);
}

function updateLedDisplay() {
  //let ledDisplayTextArray = [" "].concat(playlist.items_[playlist.currentIndex_].sources[0].filename.split(""));
  let ledDisplayTextArray = [" "].concat(song_title.split(""));
  ledDisplayIndex++;
  ledDisplayIndex = ledDisplayIndex % ledDisplayTextArray.length;
  let ledDisplayMaxIndex = Math.max(12, ledDisplayIndex + 12);
  let ledDisplayText = ledDisplayTextArray.slice(ledDisplayIndex, ledDisplayMaxIndex).join("");
  if (ledDisplayIndex + 12 >= ledDisplayTextArray.length) {
    ledDisplayText += ledDisplayTextArray.slice(0, (12 - ledDisplayText.length) % 12).join("");
  }
  if (mediaElement.paused) {
    ledDisplayFront.innerText = "00:00/00:00-" + ledDisplayText;
    return;
  }
  if (time_mode == "playing") {
    ledDisplayFront.innerText = secondsToHHMMSS(mediaElement.currentTime) + '/' + secondsToHHMMSS(mediaElement.duration) + "-" + ledDisplayText;
  } else if (time_mode == "remaining") {
    ledDisplayFront.innerText = secondsToHHMMSS(mediaElement.duration - mediaElement.currentTime) + '/' + secondsToHHMMSS(mediaElement.duration) + "-" + ledDisplayText;
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
vledDiplay.drawText(song_title, 30, -1);
//vledDiplay.rotate('left', 30);
//setInterval(updateLedDisplay, 100);
var vledDisplayTimer = 0;//setInterval(vledDisplayClockTimer, 1000);
function updateLedDisplay2() {
  clearInterval(vledDisplayTimer);
  vledDisplayTimer = 0;

  vledDiplay.drawText(song_title, 30, -1);

  vledDisplayTimer = setInterval(vledDisplayClockTimer, 1000);
}

if (currentDisplay == "led") {
  matrix.style.display = 'block';
  vledDiplay.rotate('left', 30);
  updateLedDisplay2();
}

function vledDisplayClockTimer() {
  if (time_mode == "playing") {
    vledDiplay.drawText(secondsToHHMMSS(mediaElement.currentTime), 0, 30);
  } else if (time_mode == "remaining") {
    vledDiplay.drawText(secondsToHHMMSS(mediaElement.duration - mediaElement.currentTime), 0, 30);
  }
}

function chageTimeMode() {
  if (time_mode == "playing") {
    time_mode = "remaining";
  } else if (time_mode == "remaining") {
    time_mode = "playing";
  }
}

document.addEventListener("displayPresetChange", function (event) {
  currentDisplay = event.detail;
  if (currentDisplay == "led") {
    clearInterval(ledDisplayTimer);
    ledDisplayTimer = 0;
    ledDisplayBack.style.display = 'none';

    matrix.style.display = 'block';
    vledDiplay.rotate('left', 30);
    updateLedDisplay2();
  } else if (currentDisplay == "lcd") {
    clearInterval(vledDisplayTimer);
    vledDisplayTimer = 0;
    vledDiplay.stop();
    matrix.style.display = 'none';

    ledDisplayBack.style.display = 'block';
    ledDisplayTimer = setInterval(updateLedDisplay, 400);
  }
});


/////////////////////////////////////////////////////

// Add a playlist info element to your HTML
var pl_info = document.createElement("div");
pl_info.id = "pl_info";
Object.assign(pl_info.style, {
  position: 'relative',
  height: 'calc(100vh - 20px)',
  overflow: 'auto',
  border: '2px solid ' + "var(--primary-color)",
  marginLeft: '10px',
  color: "var(--primary-color)",
  /*padding: '10px',*/
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: "#111111"
});

var pl_info_controls = document.createElement("div");
Object.assign(pl_info_controls.style, {
  height: "18px"
});

var pl_info_controlBtn = document.createElement("button");
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

var pl_info_controlBtnIcon = document.createElement("i");
pl_info_controlBtnIcon.className = "fa fa-search";
pl_info_controlBtn.appendChild(pl_info_controlBtnIcon);
pl_info_controls.appendChild(pl_info_controlBtn);

pl_info.appendChild(pl_info_controls);

var pl_info_tabs_cont = document.createElement("div");
Object.assign(pl_info_tabs_cont.style, {
  paddingLeft: '10px',
  width: '100%',
  height: '22px',
  display: 'flex',
  borderBottom: '2px solid var(--primary-color)'
});

var pl_info_tab_lyrics = document.createElement("div");
pl_info_tab_lyrics.className="active-tab";
pl_info_tab_lyrics.innerText = "lyrics";
pl_info_tab_lyrics.onclick = function () {
  pl_lyriscontainer.style.display = 'block';
  pl_info_tab_lyrics.className="active-tab";

  pl_info_infocontainer.style.display = 'none';
  pl_info_tab_info.className="inactive-tab";
};
pl_info_tabs_cont.appendChild(pl_info_tab_lyrics);

var pl_info_tab_info = document.createElement("div");
pl_info_tab_info.className="inactive-tab";
pl_info_tab_info.innerText = "info";
pl_info_tab_info.onclick = function () {
  pl_lyriscontainer.style.display = 'none';
  pl_info_tab_lyrics.className="inactive-tab";

  pl_info_infocontainer.style.display = 'block';
  pl_info_tab_info.className="active-tab";
}
pl_info_tabs_cont.appendChild(pl_info_tab_info);

pl_info.appendChild(pl_info_tabs_cont);


var pl_lyriscontainer = document.createElement("div");
pl_lyriscontainer.id = "pl_lyriscontainer";
Object.assign(pl_lyriscontainer.style, {
  padding: "10px",
  width: "100%",
  color: "var(--primary-color)",
  fontSize: "14px"
});

pl_info.appendChild(pl_lyriscontainer);

var pl_info_infocontainer = document.createElement("div");
pl_info_infocontainer.id = "pl_info_infocontainer";
Object.assign(pl_info_infocontainer.style, {
  width: "100%",
  color: "var(--primary-color)",
  fontSize: "14px",
  display: "none",
  padding: "10px"
});

var pl_infocont_imagecont = document.createElement("div");
pl_infocont_imagecont.className="song-image";

var pl_infocont_image = document.createElement("img");
pl_infocont_image.src="";
pl_infocont_imagecont.appendChild(pl_infocont_image);
pl_info_infocontainer.appendChild(pl_infocont_imagecont);

var pl_info_infosonginfocont = document.createElement("div");
pl_info_infosonginfocont.className="song-info";

var pl_info_artist_p = document.createElement("p");

var pl_info_artist_text = document.createElement("b");
pl_info_artist_text.innerText = "Artist: ";
pl_info_artist_p.appendChild(pl_info_artist_text);

var pl_info_artist_link = document.createElement("a");
pl_info_artist_link.style.color= 'white';
pl_info_artist_link.href="";
pl_info_artist_link.target = "_blank";
pl_info_artist_link.innerText = "";

pl_info_artist_p.appendChild(pl_info_artist_link);

pl_info_infosonginfocont.appendChild(pl_info_artist_p);

var pl_info_song_p = document.createElement("p");

var pl_info_song_text = document.createElement("b");
pl_info_song_text.innerText = "Song: ";
pl_info_song_p.appendChild(pl_info_song_text);

var pl_info_song_link = document.createElement("a");
pl_info_song_link.style.color= 'white';
pl_info_song_link.href="";
pl_info_song_link.target = "_blank";
pl_info_song_link.innerText = "";

pl_info_song_p.appendChild(pl_info_song_link);

pl_info_infosonginfocont.appendChild(pl_info_song_p);

var pl_info_release_p = document.createElement("p");

var pl_info_release_text = document.createElement("b");
pl_info_release_text.innerText = "Release Date: ";
pl_info_release_p.appendChild(pl_info_release_text);

var pl_info_release_value = document.createElement("span");
pl_info_release_value.style.color= 'white';
pl_info_release_value.innerText = "";
pl_info_release_p.appendChild(pl_info_release_value);

pl_info_infosonginfocont.appendChild(pl_info_release_p);

pl_info_infocontainer.appendChild(pl_info_infosonginfocont);

pl_info.appendChild(pl_info_infocontainer);


function updateInfoPanel(data){
  if (data.error) {
    pl_lyriscontainer.innerText = data.error;
    pl_lyrics_loader.style.display = 'none';
  } else {
    var body = data.body;
    var lyrics = data.lyrics[0];
    lyrics = lyrics.replace(/\d+\s\w+butors/gm, ` `);
    lyrics = lyrics.replace(/Lyrics/gm, `\n\n`);
    pl_lyriscontainer.innerText = lyrics;
    song_title = body['artist_names'] + ' - ' + body['title'];
    updateLedDisplay2();

    pl_infocont_image.src = body.header_image_thumbnail_url;
    pl_info_song_link.innerText = body.title;
    pl_info_song_link.href = body.url;
    pl_info_artist_link.innerText = body.artist_names;
    pl_info_artist_link.href = body.primary_artist.url;
    pl_info_release_value.innerText=body.release_date_for_display;
  }
}

// Add a loader element to your HTML
/* var pl_lyrics_loader = document.createElement('div');
pl_lyrics_loader.innerText = 'Loading...';
pl_lyrics_loader.style.position = 'absolute';
pl_lyrics_loader.style.top = '50%';
pl_lyrics_loader.style.left = '50%';
pl_lyrics_loader.style.transform = 'translate(-50%, -50%)';
pl_lyrics_loader.style.backgroundColor = 'rgba(50, 50, 50, 0.5)';
pl_lyrics_loader.style.color = 'white';
pl_lyrics_loader.style.padding = '10px';
pl_lyrics_loader.style.borderRadius = '5px'; */

//<!-- https://cssloaders.github.io/ -->
var sheet = window.document.styleSheets[0];
sheet.insertRule('@keyframes rotation {\
  0% {transform: rotate(0deg);}\
  100% {transform: rotate(360deg);}\
}', sheet.cssRules.length);

var pl_lyrics_loader = document.createElement('span');
window['pl_lyrics_loader'] = pl_lyrics_loader;
pl_lyrics_loader.style.position = 'absolute';
pl_lyrics_loader.style.top = '50%';
pl_lyrics_loader.style.left = '50%';
pl_lyrics_loader.style.width = '48px';
pl_lyrics_loader.style.height = '48px';
pl_lyrics_loader.style.border = '5px solid';
pl_lyrics_loader.style.borderColor = 'var(--primary-color) transparent';
pl_lyrics_loader.style.borderRadius = '50%';
pl_lyrics_loader.style.display = 'inline-block';
pl_lyrics_loader.style.boxSizing = 'border-box';
pl_lyrics_loader.style.animation = 'rotation 1s linear infinite';

// Append the loader to the modal body
pl_info.appendChild(pl_lyrics_loader);

document.getElementById('lyrics').appendChild(pl_info);


// Add an event listener to the playlist
playlist.addEventListener('playlistitemload', () => {
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

  // Show the loader
  pl_lyrics_loader.style.display = 'block';
  $.get(URLJoin(location.origin, '/api/getLyrics?title=') + playlist.items_[playlist.getCurrentIndex()].sources[0].filename + '&path=' + playlist.items_[playlist.getCurrentIndex()].sources[0].src, function (data) {
    pl_lyrics_loader.style.display = 'none';
    data = JSON.parse(data);
    updateInfoPanel(data);
  });

});

document.addEventListener("songInfoChange", (event) => {
  var data = event.detail;
  updateInfoPanel(data);
});


mediaElement.addEventListener("timeupdate", (event) => {
  document.getElementById('player_progress').value = mediaElement.currentTime;
  if (time_mode == "playing") {
    document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  } else if (time_mode == "remaining") {
    document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.duration - mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  }
});

mediaElement.addEventListener("playing", (event) => {
  document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
});

mediaElement.addEventListener("pause", (event) => {
  document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
});

let current_primary_color = primary_color;
document.addEventListener("primaryColorChange", (event) => {
  if (current_primary_color != primary_color && (current_audiomotion_preset == "default" || current_audiomotion_preset == "mirror")) {
    current_primary_color = primary_color;
    setGradient();
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

document.addEventListener("playlistChangeEvent", (event) => {
  playlist.setItems(event.detail);
  playlist.loadPlaylistItem(0);

  play_list.remove();
  play_list = document.createElement("ul");
  play_list.id = "playlist_ul";
  Object.assign(play_list.style, {
    /*height: "400px",*/
    overflowY: "auto",
    color: "var(--primary-color)",
    marginBottom: "12px",
    padding: "5px"
  });

  for (let index = 0; index < playlist.items_.length; index++) {
    const file = playlist.items_[index].sources[0].filename;

    var liObj = document.createElement("li");
    liObj.style.listStyle = "decimal";
    liObj.style.listStylePosition = 'inside';
    liObj.style.cursor = "pointer";
    liObj.style.padding = "3px";
    liObj.style.fontSize = "14px";
    liObj.style.marginBottom = "3px";
    if (index == 0) {
      liObj.style.backgroundColor = "var(--primary-color)";
      liObj.style.color = "#111111";
      liObj.style.fontWeight = '700';
    } else {
      liObj.style.backgroundColor = 'transparent';
      liObj.style.fontWeight = 'normal';
      liObj.style.color = "var(--primary-color)";
    }

    var aObj = document.createElement("a");
    aObj.href = "javascript:void(0)";
    aObj.innerText = file;
    aObj.index = index;
    aObj.style.color = "inherit";
    aObj.style.fontWeight = '700';
    aObj.style.textDecoration = 'none';
    aObj.style.cursor = "pointer";
    aObj.style.fontSize = "14px";
    aObj.addEventListener('click', function () {
      playlist.loadPlaylistItem(this.index);
      //playlist.togglePlay();
      document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
      var liObjs = Array.from(this.parentElement.parentElement.getElementsByTagName('li'));
      liObjs.forEach(element => {
        element.style.backgroundColor = 'transparent';
        element.style.fontWeight = 'normal';
        element.style.color = "var(--primary-color)";
      });

      this.parentElement.style.backgroundColor = "var(--primary-color)";
      this.parentElement.style.fontWeight = '700';
      this.parentElement.style.color = "#111111";
    });
    liObj.appendChild(aObj);

    play_list.appendChild(liObj);
  }
  playlist_cont.appendChild(play_list);
});

document.getElementById('player_progress').addEventListener('change', (event) => {
  mediaElement.currentTime = document.getElementById('player_progress').value;
});

document.getElementById('player_mute').addEventListener('click', () => {
  mediaElement.muted = !mediaElement.muted;
  if (mediaElement.muted) {
    document.getElementById('player_mute').innerHTML = '<i class="fa fa-solid fa-volume-off"></i>';
  } else {
    document.getElementById('player_mute').innerHTML = '<i class="fa fa-solid fa-volume-up"></i>';
  }
});


window.addEventListener('keyup', () => {
  if (event.keyCode == 32 && window['focusSearchInput']==false) {
    playlist.togglePlay();
    if (mediaElement.paused) {
      document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
    } else {
      document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
    }
  }
});



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
  left: 'calc(50% - 255px)',
  top: '10px'
})
document.getElementById('analyzer').appendChild(guidomElement);
