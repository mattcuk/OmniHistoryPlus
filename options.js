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
        $('#message').html('\'Number of results to retrieve from Chrome API\' needs to be above 0 and below 250.');
    }

    if (!isNaN(maxSuggestionsDisplay) && maxSuggestionsDisplay > 0 && maxSuggestionsDisplay < 30) {
        chrome.storage.local.set({ maxSuggestionsDisplay: parseInt(maxSuggestionsDisplay) });
        $('#message').html('Setting saved.');
    } else {
        $('#message').html('\'Max results to filter for display\' in the omnibar itself. Needs to be below 30.');
    }

    chrome.storage.local.set({ showDebug: showDebug });

});
