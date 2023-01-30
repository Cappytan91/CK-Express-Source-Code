

function onload () {
    document.addEventListener("DOMContentLoaded", function() {
        var mode = getParameterByName("mode", document.location.href);
        
        if (mode === "1") {
            document.getElementsByClassName("new-installation title")[0].classList += " show";
            document.getElementsByClassName("vertical-center")[0].classList += " new-installation-container";
        }
    })
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