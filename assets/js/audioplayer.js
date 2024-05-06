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
    color: {
      trackColorBack: '#ffffff',
      trackColorOver:  "var(--primary-color)",
      trackBorderColor: '#dddddd',
      thumbColor:  "var(--primary-color)",
      thumbBorderColor:  "var(--primary-color)",
      ticksColor:  "var(--primary-color)"
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
  // add HTML elements for this band
  /* controls.innerHTML += `
  <div class="eqband">
    <label>${freq < 1000 ? freq : freq / 1000 + 'k'}Hz</label>
    <input class="equalizer" type="range" value="0" step="1" min="-12" max="12" list="tickmarks" orient="vertical" data-filter="${i}">
    <output id="gain${i}">0 dB</output>
  </div>`; */

  /*   controls.innerHTML += `
    <div class="eqband">
      <label>${freq < 1000 ? freq : freq / 1000 + 'k'}Hz</label>
      <vertical-slider class="equalizer" value="0" step="1" min="-12" max="12" list="tickmarks" orient="vertical" data-filter="${i}"></vertical-slider>
      <output id="gain${i}">0 dB</output>
    </div>`; */
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

const audioMotion = new AudioMotionAnalyzer(
  document.getElementById('analyzer'),
  {
    source: filters[filters.length - 1],
    gradient: 'chocolate',
  }
);

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

// add event listeners for playback and equalizer control

/* document.getElementById('play').addEventListener('click', () => mediaElement.play());
document.getElementById('stop').addEventListener('click', () => mediaElement.pause()); */

/* document.querySelectorAll('.equalizer').forEach(el => {
  el.addEventListener('input', changeGain);
}); */

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

//create playlist html
var playlist_cont = document.getElementById("playlist_cont");

var play_list = document.createElement("ul");
play_list.id = "playlist_ul";
Object.assign(play_list.style, {
  height: "400px",
  overflowY: "auto",
  color:  "var(--primary-color)",
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
    liObj.style.backgroundColor = 'white';
    liObj.style.fontWeight = '700';
  }

  var aObj = document.createElement("a");
  aObj.href = "javascript:void(0)";
  aObj.innerText = file;
  aObj.index = index;
  aObj.style.color = "var(--primary-color)";
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
      element.style.color =  "var(--primary-color)";
    });

    this.parentElement.style.backgroundColor = 'white';
    this.parentElement.style.fontWeight = '700';
  });
  liObj.appendChild(aObj);

  play_list.appendChild(liObj);
}
playlist_cont.appendChild(play_list);

playlist.addEventListener('playlisttoggleplay', () => {
  if (mediaElement.paused) {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-pause"></i>';
  } else {
    document.getElementById('play-track-btn').innerHTML = '<i class="fa fa-solid fa-play"></i>';
  }
});

// Playlist controls
var prevtrackbtn = document.getElementById("prev-track-btn");
var nexttrackbtn = document.getElementById("next-track-btn");
var playtrackbtn = document.getElementById("play-track-btn");
var shufflebtn = document.getElementById("shuffle-btn");
var repeatbtn = document.getElementById("repeat-btn");
prevtrackbtn.addEventListener('click', () => playlist.loadPlaylistItem(playlist.getPreviousIndex()));
nexttrackbtn.addEventListener('click', () => playlist.loadPlaylistItem(playlist.getNextIndex()));
playtrackbtn.addEventListener('click', () => playlist.togglePlay());
shufflebtn.addEventListener('click', () => playlist.toggleShuffle());
repeatbtn.addEventListener('click', () => playlist.enableRepeat());

// Add a playlist info element to your HTML
var pl_info = document.createElement("div");
pl_info.id = "pl_info";
Object.assign(pl_info.style, {
  position: 'relative',
  height: 'calc(100vh - 30px)',
  overflow: 'auto',
  border: '2px solid ' +  "var(--primary-color)",
  marginLeft: '10px',
  color:  "var(--primary-color)",
  padding: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: "#111111"
});

var pl_lyriscontainer = document.createElement("div");
pl_lyriscontainer.id = "pl_lyriscontainer";
Object.assign(pl_lyriscontainer.style, {
  width: "100%",
  color:  "var(--primary-color)",
  fontSize: "14px"
});

pl_info.appendChild(pl_lyriscontainer);

// Add a loader element to your HTML
var pl_lyrics_loader = document.createElement('div');
pl_lyrics_loader.innerText = 'Loading...';
pl_lyrics_loader.style.position = 'absolute';
pl_lyrics_loader.style.top = '50%';
pl_lyrics_loader.style.left = '50%';
pl_lyrics_loader.style.transform = 'translate(-50%, -50%)';
pl_lyrics_loader.style.backgroundColor = 'rgba(50, 50, 50, 0.5)';
pl_lyrics_loader.style.color = 'white';
pl_lyrics_loader.style.padding = '10px';
pl_lyrics_loader.style.borderRadius = '5px';

// Append the loader to the modal body
pl_info.appendChild(pl_lyrics_loader);

document.getElementById('lyrics').appendChild(pl_info);


// Add an event listener to the playlist
playlist.addEventListener('playlistitemload', () => {
  var liItems = document.getElementById('playlist_ul').getElementsByTagName('li');
  for (let index = 0; index < liItems.length; index++) {
    let li = liItems[index];
    if (index == playlist.getCurrentIndex()) {
      li.style.backgroundColor = 'white';
      li.style.fontWeight = '700';
      li.style.fontWeight = 'bold';
    } else {
      li.style.backgroundColor = 'transparent';
      li.style.fontWeight = 'normal';
    }
  }

  // Show the loader
  pl_lyrics_loader.style.display = 'block';
  $.get(URLJoin(location.origin, '/api/getLyrics?title=', playlist.items_[playlist.getCurrentIndex()].sources[0].filename), function (data) {
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
      //document.getElementById('pl-player_html5_api').poster = body.header_image_thumbnail_url
    }
  });
});

let current_primary_color = primary_color;

mediaElement.addEventListener("timeupdate", (event) => {
  document.getElementById('player_progress').value = mediaElement.currentTime;
  document.getElementById('player_timer').innerText = secondsToHHMMSS(mediaElement.currentTime) + ' / ' + secondsToHHMMSS(mediaElement.duration);
  if(current_primary_color!=primary_color){
    current_primary_color = primary_color;
    setGradient();
  }
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