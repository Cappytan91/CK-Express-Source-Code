var proxyActive = false;
var UNDEFINED;
var clickEventRegistered = false;
var proxyServerRunning = false;
var proxyConfigured 

function defined (value) {
    return value != null && value != UNDEFINED;
}

function toggleProxyActive (event) {
    var localProxyActive = !proxyActive;
    updateProxyActiveLocalCache(localProxyActive);
}

function onload () {
    getStatus();
}

function getStatus () {
    chrome.runtime.sendMessage({ from: 'popup', update: true }, function(response) {
        if (!defined(response)) {
            return;
        }
        if (defined(response.hideProxyEnableToggle)) {
            setToggleVisibility(response.hideProxyEnableToggle);
        }
        if (defined(response.proxyState)) {
            proxyActive = JSON.parse(response.proxyState);
            updateProxyToggleWidget();
        }
        if (defined(response.proxyServerRunning)) {
            proxyServerRunning = JSON.parse(response.proxyServerRunning);
            updateServerElements(proxyServerRunning);
        }
        if (defined(response.message)) {
            updateProxyMessage(response.message);
        }
        if (defined(response.disabled) && JSON.parse(response.disabled) === true) {
            disableToggle();
        }
        if (defined(response.username)) {
            $('#username').text(response.username);
        }
        if (defined(response.domain)) {
            $('#domain').text(response.domain);
        }
        if (defined(response.health)) {
            updateHealth(response.health);
        }
        if (defined(response.version)) {
            updateVersion(response.version);
        }
        if (defined(response.model)) {
            updateModel(response.model);
        }
        if (defined(response.modelCheck)) {
            updateModelCheck(response.modelCheck);
        }
        if (defined(response.serialNumber)) {
            updateSerialNumber(response.serialNumber);
        }
        if (defined(response.mode)) {
            updateMode(response.mode);
        }
        if (defined(response.startup)) {
            updateStartup(response.startup);
        }
        if (defined(response.proxyConfigured)) {
            updateProxyConfigured(response.proxyConfigured);
        }
    });
}

function updateProxyActiveLocalCache (value) {
    chrome.runtime.sendMessage({ from: 'popup', updateLocalStorage: true, value: value }, function(response) {
        proxyActive = JSON.parse(response.value);
        updateProxyToggleWidget();
        updateProxyMessage(response.message);
    });
}

function updateServerElements (running) {
    if (running) {
        $('#proxyServerStatus').text('Running');
        $('#proxyServerStatus').removeClass('red');
        $('#proxyServerStatus').addClass('green');
    } else {
        $('#proxyServerStatus').text('Offline');
        $('#proxyServerStatus').removeClass('green');
        $('#proxyServerStatus').addClass('red');
    }
}

function updateProxyMessage (message) {
    if (defined(message)) {
        $('#message').text(message);
    }
}

function updateProxyToggleWidget() {
    $('#proxyToggle').attr('active', proxyActive);
    if (proxyActive) {
        $('#proxyToggle .toggle-background').text("ON");
    } else {
        $('#proxyToggle .toggle-background').text("OFF");
    }
}

function disableToggle () {
    $('#proxyToggle').attr('disabled', true);
}

function enableToggle () {
    $('#proxyToggle').attr('disabled', null);
}

function updateHealth (health) {
    updateElementValue('serverStarted', health.server.started);
    updateElementValue('classificationReady', health.server.classificationReady);
    updateElementValue('watchdogStarted', health.watchdog.started);
    updateElementValue('watchdogSent', health.watchdog.sent);
    updateElementValue('watchdogReceived', health.watchdog.received);
    updateElementValue('watchdogTimedout', health.watchdog.timedout);
    updateElementValue('ip', health.ip);
    updateElementValue('platformName', health.platform.name);
    updateElementValue('online', health.online);
}

function updateElementValue(elementId, value) {
    var element = $('#' + elementId);

    if (element.length > 0 && defined(value)) {
        element.text(value);
    }
}

function updateVersion (version) {
    var versionElement = document.getElementById('version');
    versionElement.innerText = '(' + version + ')';
}

function setToggleVisibility(hide) {
    var toggleHtml = '<div class="margin-top-5 flex-row" id="serviceContainer">';
    toggleHtml +=       '<span class="label bold">Service</span>';
    toggleHtml +=       '<span class="bold" id="proxyServerStatus"></span>';
    toggleHtml +=    '</div>';
    toggleHtml +=    '<div class="margin-top-5 flex-row" id="proxyToggleContainer">';
    toggleHtml +=       '<span class="label bold">Filtering</span>';
    toggleHtml +=       '<label class="toggle" id="proxyToggle" >';
    toggleHtml +=           '<input type="checkbox" disabled/>';
    toggleHtml +=           '<span class="toggle-background noselect"></span>';
    toggleHtml +=       '</label>';
    toggleHtml +=     '</div>';
    var toggleContainerElement = $('#proxyToggleContainer');
    var proxyServerStatusContainerElement = $('#proxyServerStatusContainer');
    var serviceContainerElement = $('#serviceContainer');
    var newToggleContainerElement = $(toggleHtml);

    if (proxyServerStatusContainerElement.length > 0) {
        if (hide) {
            if (toggleContainerElement.length > 0) {
                toggleContainerElement.remove();
            }
            if (serviceContainerElement.length > 0) {
                serviceContainerElement.remove();
            }
        } else {
            if (toggleContainerElement.length === 0) {
                newToggleContainerElement.insertAfter(proxyServerStatusContainerElement);
                registerClickEvent();
            }
        }
    }
}

function registerClickEvent() {
    var toggleElement = document.getElementById('proxyToggle');

    if (toggleElement) {
        toggleElement.removeEventListener('click', toggleProxyActive);
        toggleElement.addEventListener('click', toggleProxyActive);
        clickEventRegistered = true;
    }
}

function updateModel(value) {
    var truncatedValue = truncateText(value, 25);
    updateElementValue('model', truncatedValue);
}

function updateModelCheck(value) {
    updateElementValue('modelCheck', value);
}

function updateSerialNumber(value) {
    var truncatedValue = truncateText(value, 25);
    updateElementValue('serialNumber', truncatedValue);
}

function updateMode(value) {
    updateElementValue('mode', value);
}

function updateStartup(value) {
    updateElementValue('startup', value);
}

function truncateText(text, maxLimit) {
    if (text.length <= maxLimit) {
        return text;
    }

    return text.substring(0, maxLimit) + '...';
}

function updateProxyConfigured(proxyConfigured) {
    var active = proxyConfigured ? true : false;
    if (active) {
        $('#proxyToggle').attr('active', proxyActive);
        if (proxyActive) {
            $('#proxyToggle .toggle-background').text("ON");
        } else {
            $('#proxyToggle .toggle-background').text("OFF");
        }
    } else {
        $('#proxyToggle').attr('active', active);
        $('#proxyToggle .toggle-background').text("GSR");
        disableToggle();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (!clickEventRegistered) {
        onload();
        registerClickEvent();
    }
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.from === 'ckbackground') {
            if (defined(request.hideProxyEnableToggle)) {
                setToggleVisibility(request.hideProxyEnableToggle);
                updateProxyToggleWidget();
            }
            if (request.proxyServerActiveChange) {
                proxyServerRunning = JSON.parse(request.proxyServerRunning);
            }
            if (defined(request.proxyState)) {
                proxyActive = JSON.parse(request.proxyState);
            }
            if (request.username) {
                $('#username').text(request.username);
            }
            if (request.domain) {
                $('#username').text(request.domain);
            }
            if (request.health) {
                updateHealth(request.health);
                updateServerElements(request.health.server.classificationReady)
            }
            if (defined(request.disabled)) {
                if (JSON.parse(request.disabled) === true) {
                    disableToggle();
                } else {
                    enableToggle();
                }
            }
            if (defined(request.model)) {
                updateModel(request.model);
            }
            if (defined(request.modelCheck)) {
                updateModelCheck(request.modelCheck);
            }
            if (defined(request.serialNumber)) {
                updateSerialNumber(request.serialNumber);
            }
            if (defined(request.mode)) {
                updateMode(request.mode);
            }
            if (defined(request.startup)) {
                updateStartup(request.startup);
            }
            if (defined(request.proxyConfigured))  {
                updateProxyConfigured(request.proxyConfigured);
            }
        }

        return true;
    }
);