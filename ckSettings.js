var UNDEFINED;
function defined (value) {
    return value != null && value != UNDEFINED;
}

function onload () {
    document.addEventListener("DOMContentLoaded", function() {
        var mode = getParameterByName("mode", document.location.href);
        var text = "Connection settings warning<br>Please contact your administrator";

        if (mode === "2") {
            text = "System compatibility check complete<br>Result: Device Not Supported<br><br>You can now continue browsing the Internet";
            document.getElementsByClassName("description-container")[0].classList += " not-supported";
            sendDeviceNotSupported();
        }

        document.getElementsByClassName("description")[0].innerHTML = text;
    })
}

function sendDeviceNotSupported () {
    chrome.runtime.sendMessage({ from: 'ckSettings', deviceSupported: false }, function(response) {
        proxyActive = JSON.parse(response.value);
        updateProxyToggleWidget();
        updateProxyMessage(response.message);
    });
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

onload();