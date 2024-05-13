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

  export {URLJoin, secondsToHHMMSS}