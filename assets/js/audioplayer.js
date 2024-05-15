/**
 * This web implements a frequency equalizer
 * connected to audioMotion-analyzer
 *
 * Original equalizer code by Osman Colakoglu
 *
 * For audioMotion-analyzer documentation and
 * more demos, visit https://audiomotion.dev
 */


import { URLJoin, secondsToHHMMSS, median } from './audioplayer_utils.js';
import AudioMotionAnalyzer from './audioMotion-analyzer.js';
import Playlist from './audioplayer_playlist.js';
import { build_play_list_ul, build_play_list, build_lcdisplay, build_pl_info, build_loader } from './audioplayer_builders.js';
import XverticalSlider from './xvertical-slider.js';
import XVirtualLedDisplay from './xvirtualleddisplay.js';

const ctx = window.AudioContext || window.webkitAudioContext;
const context = new ctx();

const audioContainer = document.getElementById('audio-container');
// create new <audio> element
let mediaElement = (audioList.length > 0) ? new Audio(audioList[0].sources[0].src) : new Audio();
mediaElement.controls = true;
mediaElement.crossOrigin = 'anonymous';
mediaElement.style.display = 'none';
//mediaElement.onloadstart  = () => messageDiv.innerText = 'Buffering audio... please wait...';
mediaElement.onloadeddata = () => {
  document.getElementById('player_progress').max = mediaElement.duration;
  document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  //mediaElement.play();
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
  eqbandLabel.style.color='var(--primary-color)';
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
  eqbandOutput.style.color='var(--primary-color)';
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

setGradient();

function changeGain(target) {
  const value = parseFloat(target.value),
    nbFilter = target.dataset.filter,
    output = document.querySelector('#gain' + nbFilter);

  filters[nbFilter].gain.value = value;
  output.value = (value > 0 ? '+' : '') + value + ' dB';
}


//////////////////////////////////// PLAYLIST /////////////////////////////////////////////////
// instantiate the playlist
let playlist = Playlist.from(audioList, mediaElement);
window.playlist = playlist;

let song_title = (playlist.items_.length > 0) ? playlist.items_[0].sources[0].filename : "";
document.title = "Audio Player - " + song_title;

//create playlist html
let playlist_cont = document.getElementById("playlist_cont");
playlist_cont.style.overflow="hidden";

let play_list = build_play_list_ul();

for (let index = 0; index < playlist.items_.length; index++) {
  const file = playlist.items_[index].sources[0].filename;

  var liObj = build_play_list(file, index, playListItemClicked);

  play_list.appendChild(liObj);
}
playlist_cont.appendChild(play_list);

function playListItemClicked(target) {
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
  let lcdDisplayTextArray = [" "].concat(song_title.split(""));
  lcdDisplayIndex++;
  lcdDisplayIndex = lcdDisplayIndex % lcdDisplayTextArray.length;
  let lcdDisplayMaxIndex = Math.max(12, lcdDisplayIndex + 12);
  let lcdDisplayText = lcdDisplayTextArray.slice(lcdDisplayIndex, lcdDisplayMaxIndex).join("");
  if (lcdDisplayIndex + 12 >= lcdDisplayTextArray.length) {
    lcdDisplayText += lcdDisplayTextArray.slice(0, (12 - lcdDisplayText.length) % 12).join("");
  }
  if (mediaElement.paused) {
    lcdDisplayFront.innerText = "00:00/00:00-" + lcdDisplayText;
    return;
  }
  if (time_mode == "playing") {
    lcdDisplayFront.innerText = secondsToHHMMSS(mediaElement.currentTime) + '/' + secondsToHHMMSS(mediaElement.duration) + "-" + lcdDisplayText;
  } else if (time_mode == "remaining") {
    lcdDisplayFront.innerText = secondsToHHMMSS(mediaElement.duration - mediaElement.currentTime) + '/' + secondsToHHMMSS(mediaElement.duration) + "-" + lcdDisplayText;
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


////////////////////// PLAYLIST INFO ///////////////////////////////

// Add a playlist info element to your HTML
let [pl_info, pl_info_controls, pl_info_controls_hidelabel, pl_info_controlBtn, pl_info_controlBtnIcon, pl_info_tabs_cont, pl_info_tab_lyrics, 
  pl_info_tab_info, pl_lyriscontainer, pl_info_infocontainer, pl_infocont_imagecont, pl_infocont_image, pl_info_infosonginfocont, 
  pl_info_artist_p, pl_info_artist_link, pl_info_song_p, pl_info_song_link, pl_info_release_p, pl_info_release_text, pl_info_release_value] = build_pl_info();

function updateInfoPanel(data) {
  if (data.error) {
    pl_lyriscontainer.innerText = data.error;
    pl_lyrics_loader.style.display = 'none';
  } else {
    var body = data.body;
    var lyrics = data.lyrics[0];
    lyrics = lyrics.replace(/\d+\s\w+butors/gm, ` `);
    lyrics = lyrics.replace(/Lyrics/gm, `\n\n`);

    lyrics = lyrics.replace(new RegExp("^\s*.*"+body.title),body.title);
    lyrics = lyrics.replace(/\$\d+You might also like/, "");
    lyrics = lyrics.replace(body.pyongs_count+"Embed", "");
    
    pl_lyriscontainer.innerText = "";
    pl_lyrics_loader.style.display = 'none';

    pl_lyriscontainer.innerText = lyrics;
    song_title = body['artist_names'] + ' - ' + body['title'];
    updateLedDisplay2();

    pl_infocont_image.src = body.header_image_thumbnail_url;
    pl_info_song_link.innerText = body.title;
    pl_info_song_link.href = body.url;
    pl_info_artist_link.innerText = body.artist_names;
    pl_info_artist_link.href = body.primary_artist.url;
    pl_info_release_value.innerText = body.release_date_for_display;
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
  $.get(URLJoin(location.origin, '/api/getLyrics?title=') + playlist.items_[playlist.getCurrentIndex()].sources[0].filename.substr(playlist.items_[playlist.getCurrentIndex()].sources[0].filename.lastIndexOf("/") + 1) + '&path=' + playlist.items_[playlist.getCurrentIndex()].sources[0].src, function (data) {
    pl_lyrics_loader.style.display = 'none';
    data = JSON.parse(data);
    updateInfoPanel(data);
  })
    .fail(function () {
      const data = { 'error': 'Lyrics not found.' };
      updateInfoPanel(data);
    });

});

document.addEventListener("songInfoChange", (event) => {
  var data = event.detail;
  updateInfoPanel(data);
});

/* let voice_range_energy = [0.5];
let m0=0, m1=0.5; */
mediaElement.addEventListener("timeupdate", (event) => {
  document.getElementById('player_progress').value = mediaElement.currentTime;
  if (time_mode == "playing") {
    document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  } else if (time_mode == "remaining") {
    document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.duration - mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  }

  /* let current_energy = audioMotion.getEnergy(250,700);
  voice_range_energy.push(current_energy);

  if (voice_range_energy.length > 10) {
    let m = median(voice_range_energy);
    if(m0==0){
      m0=m;
    }else{
      m1=m;
      if(Math.abs(m0-m1)>0.6){
        pl_info_controls_hidelabel.innerText = 'is singing: ' + m0.toFixed(2).toString() + ' - ' + m1.toFixed(2).toString() + ' - ' + current_energy.toFixed(2).toString();
      }else{
        pl_info_controls_hidelabel.innerText = 'NOT singing ' + m0.toFixed(2).toString() + ' - ' + m1.toFixed(2).toString() + ' - ' + current_energy.toFixed(2).toString();
      }
      m0=m1;
    }
    voice_range_energy = voice_range_energy.slice(9);
  } */
});

mediaElement.addEventListener("playing", (event) => {
  document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
});

mediaElement.addEventListener("pause", (event) => {
  document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
});

let current_primary_color = primary_color;
document.addEventListener("colorSettingsChange", (event) => {
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
  play_list = build_play_list_ul();

  for (let index = 0; index < playlist.items_.length; index++) {
    const file = playlist.items_[index].sources[0].filename;

    var liObj = build_play_list(file, index, playListItemClicked);

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


window.addEventListener('keyup', (event) => {
  if (event.key == " " && window['focusSearchInput'] == false) {
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
