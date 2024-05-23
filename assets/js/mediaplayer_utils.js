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
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60)%60;
  var seconds = Math.round(sec_num - (hours * 3600) - (minutes * 60))%60;
  var h="00", m="00", s="00";
  if (hours < 10) { h = "0" + hours; }else{ h = hours; }
  if (minutes < 10) { m = "0" + minutes; }else{ m = minutes; }
  if (seconds < 10) { s = "0" + seconds; }else{ s = seconds; }
  return (hours>0)? h + ':' + m + ':' + s: m + ':' + s;
}

const median = function (values) {

  if (values.length === 0) {
    throw new Error('Input array is empty');
  }

  // Sorting values, preventing original array
  // from being mutated.
  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  return (values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2
  );

}

export { URLJoin, secondsToHHMMSS, median };