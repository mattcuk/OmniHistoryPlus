console.log('popup.js loaded');

var _activeTab;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    _activeTab = tabs[0];
});

$('#campaignPage,#donatePage').on('click', function (event) {
    var url = $(this).prop('href');
    if(_activeTab.url.indexOf('chrome')==0) {
        chrome.tabs.update(_activeTab.id, {url: url})
    } else {
        chrome.tabs.create({url: url})
    }
});