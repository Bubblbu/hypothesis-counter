'use strict';

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

// keep track of tabIDs and annotation counts
var tabHash = {};

// match http and https URLs
var url_regex = new RegExp("^https?://");

/** helper function to format object as parameter string */
function formatParams(params) {
    return "?" + Object
        .keys(params)
        .map(function (key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}

/**
 * Takes tabId and URL and updates tabHash if URL matches http|s
 * @param {int} tabId 
 * @param {string} url 
 */
function updateAnnotationCount(tabId, url) {
    let xhr = new XMLHttpRequest();
    let api = "https://hypothes.is/api/search";
    let payload = {
        "_separate_replies": "true",
        "group": "__world__",
        "limit": 200,
        "offset": 0,
        "uri": url
    }

    xhr.open('GET', api + formatParams(payload), true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let total = JSON.parse(this.responseText)['total']
            updateHash(tabId, total);
            updateUI(tabId);
        }
    };
    xhr.send();
}

/** Updates the tabId--count hash */
function updateHash(tabId, total) {
    if (total === 0) {
        tabHash[tabId] = "";
    } else {
        tabHash[tabId] = total.toString();
    }
}

/**
 * Updates the toolbar icon and sets the correct badge
 * @param {int} tabId 
 */
function updateUI(tabId) {
    browser.browserAction.setBadgeText({
        text: tabHash[tabId],
        tabId: tabId
    });
}

/**
 * Updated/Reloaded Tabs.
 * If new URL is reloaded the annotation count is requeried and updated
 * @param {object} tabId 
 * @param {object} changeInfo 
 * @param {object} tabInfo 
 */
function handleChanged(tabId, changeInfo, tabInfo) {
    if (!changeInfo.url) return;

    if (url_regex.test(changeInfo.url)) {
        updateAnnotationCount(tabId, changeInfo.url);
    }
}
browser.tabs.onUpdated.addListener(handleChanged);

/**
 * Switch Tab.
 * If tabId is already in the hash, toolbar is updated,
 * otherwise the annotation count for URL is queried
 * @param {object} activeInfo 
 */
function handleActivated(activeInfo) {
    let tabId = activeInfo.tabId;
    if (!(tabId in tabHash)) {
        let getTab = browser.tabs.get(tabId);
        getTab.then((tabInfo) => {
            updateAnnotationCount(tabId, tabInfo.url);
        })
    } else {
        updateUI(tabId);
    }
}
browser.tabs.onActivated.addListener(handleActivated);

//* Remove tabIds from the hash if closed */
function handleRemoved(tabId) {
    delete tabHash[tabId];
}
browser.tabs.onRemoved.addListener(handleRemoved);

//* Injects code to trigger the Hypothesis on the active tab */
function showHypothesis() {
    let url = ""
    browser.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, function (tabs) {
        url = tabs[0].url;
    });

    if (!url_regex.test(url)) {
        browser.tabs.executeScript({
            code: "window.hypothesisConfig=function(){return{showHighlights:true,appType:'bookmarklet'};};let d=document,s=d.createElement('script');s.setAttribute('src','https://hypothes.is/embed.js');d.body.appendChild(s)"
        });
    }
}
browser.browserAction.onClicked.addListener(showHypothesis);