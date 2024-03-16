console.log('options.js loaded');

chrome.storage.local.get(['maxSuggestions', 'maxSuggestionsDisplay', 'showDebug', 'hoursAgo'], (data) => {
    const maxSuggestions = data.maxSuggestions || 200;
    const maxSuggestionsDisplay = data.maxSuggestionsDisplay || 10;
    const showDebug = data.showDebug || false;
    $('#maxSuggestions').val(maxSuggestions);
    $('#maxSuggestionsDisplay').val(maxSuggestionsDisplay);
    $('#showDebug').prop('checked', showDebug);
});

$('#save').on('click', function (event) {
    var maxSuggestions = $('#maxSuggestions').val();
    var maxSuggestionsDisplay = $('#maxSuggestionsDisplay').val();
    var showDebug = $('#showDebug').prop('checked');

    if (!isNaN(maxSuggestions) && maxSuggestions > 0 && maxSuggestions < 5000) {
        chrome.storage.local.set({ maxSuggestions: parseInt(maxSuggestions) });
        $('#message').html('Setting saved.');
    } else {
        $('#message').html('\'<i>Number of results to retrieve from Chrome API</i>\' needs to be between 0 and 250.');
    }

    if (!isNaN(maxSuggestionsDisplay) && maxSuggestionsDisplay > 0 && maxSuggestionsDisplay < 20) {
        chrome.storage.local.set({ maxSuggestionsDisplay: parseInt(maxSuggestionsDisplay) });
        $('#message').html('Setting saved.');
    } else {
        $('#message').html('\'<i>Max results to filter for display</i>\' in the omnibar itself. Should be between 0 and 20.');
    }

    chrome.storage.local.set({ showDebug: showDebug });

});
