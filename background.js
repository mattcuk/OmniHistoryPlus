console.log('background.js loaded');

// Useful resources;
// Icons - https://www.svgrepo.com/svg/449050/document-time
// Resizing SVGs - https://boxy-svg.com/
// Omnibox API - https://developer.chrome.com/docs/extensions/reference/api/omnibox
// Unicode icons that can be baked into code - https://symbl.cc/en/unicode/blocks/dingbats/

chrome.omnibox.onInputStarted.addListener(function () {
    chrome.omnibox.setDefaultSuggestion({
        description:
            "🚀 Search through your full browse history "
    });
});

chrome.omnibox.onInputChanged.addListener(function (searchText, suggest) {
    
    if (searchText.length>1) {
        
        chrome.storage.local.get(['maxSuggestions', 'maxSuggestionsDisplay', 'showDebug', 'hoursAgo'], (data) => {
            const maxSuggestions = data.maxSuggestions || 200;
            var maxSuggestionsDisplay = data.maxSuggestionsDisplay || 10;
            const showDebug = data.showDebug || false;

            chrome.history.search({ text: searchText, startTime: 0, maxResults: maxSuggestions }, function (results) {
                var suggestions = [];

                // Limits the total number of results in the omnibox to this.. may help with performance when dealing with long lists
                if (results.length < maxSuggestionsDisplay) maxSuggestionsDisplay = results.length;

                var titleLimit = 80; // Limits the page titles to this number of characters when displayed in the omnibox

                // Loop over history results & format them into suggestions for the omnibox to display
                for (var i = 0; i < maxSuggestionsDisplay; i++) {
                    var result = results[i];
                    if (result.title.length > 1) {

                        // Show a bit of debug info against each result. Visit count + last date accessed
                        var debugInfo = '';
                        if(showDebug) {
                            var dt = new Date(result.lastVisitTime);
                            var dtFmt = dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
                            debugInfo = '<url>[' + result.visitCount + '|' + dtFmt + ']</url> ';
                        }

                        // Format the suggestion for display & add it to the array
                        suggestions.push({
                            content: result.url,
                            description: debugInfo + addMatches(xmlEncode(limitText(result.title, titleLimit)), searchText) + ' - <url>' + addMatches(xmlEncode(tidyUrl(result.url)), searchText) + '</url>',
                            deletable: false
                        });
                    }
                }

                // Display the suggestions in the omnibar
                suggest(suggestions);
            });

        });

    }
});

chrome.omnibox.onInputEntered.addListener((url, disposition) => {
    switch (disposition) {
        case "currentTab":
            chrome.tabs.update({ url });
            break;
        case "newForegroundTab":
            chrome.tabs.create({ url });
            break;
        case "newBackgroundTab":
            chrome.tabs.create({ url, active: false });
            break;
    }
});

// Bold any matching search words found in the suggestions (handles mixed case)
function addMatches(text, searchText) {
    var searchSplit = searchText.split(' ');

    for(var i=0; i<(searchSplit.length); i++) {
        if(searchSplit[i].length>1) {
            var regEx = new RegExp(searchSplit[i], "ig");
            text = text.replace(regEx, function(match) {
                return '<match>' + match + '</match>';
            });
        }
    }
    
    return text;
}

// Encode characters for XML
function xmlEncode(str) {
    return str.replace(/&|<|>|'|"/g, (match) => {
        switch (match) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "'": return "&apos;";
            case '"': return "&quot;";
            default: return match;
        }
    });
}

// Limits a string  to a number of characters and appends ... to the end
function limitText(text, limit) {
    if(text.length>limit) text = text.substring(0, limit) + ' ... ';
    return text;
}

// Remove the protocol from domains (can be extended to do other things as needed)
function tidyUrl(url) {
    url = url.replace('https://', '');
    url = url.replace('http://', '');
    return url;
}

