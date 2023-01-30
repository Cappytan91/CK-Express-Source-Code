const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];
var UNDEFINED;
// Publish/subscribe events
var captivePortalPublishSubscribe = pubSub();
var captivePortalSubscriptionName = 'captivePortal';
var captivePortalConfiguration;
var onPremConfiguration;
var locationAwarenessPublishSubscribe = pubSub();
var locationAwarenessSubscriptionName = 'localAwareness';

function ajaxCall(url, successCallback, failCallback, timeoutCallback, timeout, headers) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                successCallback(xhr);
            } else {
                if (failCallback) {
                    failCallback(xhr);
                }
            }
        }
    }
    xhr.ontimeout = function () {
        LOG("ajax call timeout", url);
        if (timeoutCallback) {
            timeoutCallback();
        }
    }
    xhr.open('GET', url, true);
    // Comment out for now. If header includes User-Agent, JavaScript will complain
    /*
    if (headers && Array.isArray(headers)) {
        for (var i = 0; i < headers.length; i++) {
            xhr.setRequestHeader(headers[i].name, headers[i].value);
        }
    }*/
    xhr.timeout = defined(timeout) ? timeout : 5000;
    xhr.send(null);

    return xhr;
}

function LOG() {
    var output = "";
    if (defined(arguments)) {
        var date = new Date();
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const dayIndex = date.getDay();
        const dayName = days[dayIndex] ;
        const year = date.getFullYear();
        const day = date.getDate();
        let hours = date.getHours() + '';
        hours = hours.length === 1 ? '0'  + hours : hours; 
        let minutes = date.getMinutes() + '';
        minutes = minutes.length === 1 ? '0' + minutes : minutes;
        let seconds = date.getSeconds() + '';
        seconds = seconds.length === 1 ? '0' + seconds : seconds;
        const time = `${hours}:${minutes}:${seconds}`;
        var dateOutput = `${dayName}, ${day} ${monthName} ${year} ${time} - `;

        for (var i = 0; i < arguments.length; i++) {
            if (i > 0 && i <= arguments.length) {
                output += ' - ';
            }
            var value = arguments[i];
            if (typeof value === 'object') {
                output += JSON.stringify(value);
            } else {
                output += value;
            }
        }
        console.log(dateOutput, output);
    }
}

function defined (value) {
    return value != null && value != UNDEFINED;
}

/**
 * Adds a timestamp query param to disable cached result
 */
function appendTimeStampToUrl (url) {
  try {
      var urlObject = new URL(url);
      var timestamp = (new Date()).getTime();
      if (urlObject.search && urlObject.search.indexOf('?') !== -1) {
          return `${url}&ts=${timestamp}`;
      }
      return `${url}?ts=${timestamp}`;
  } catch(exception) {
      return url;
  }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}