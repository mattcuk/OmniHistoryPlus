console.log('background.js loaded');

// Useful resources;
// Icons - https://www.svgrepo.com/svg/449050/document-time
// Resizing SVGs - https://boxy-svg.com/
// Omnibox API - https://developer.chrome.com/docs/extensions/reference/api/omnibox
// Unicode icons that can be baked into code - https://symbl.cc/en/unicode/blocks/dingbats/

chrome.omnibox.onInputStarted.addListener(function () {
    chrome.omnibox.setDefaultSuggestion({
        description:
            "🚀 Search through your full browse history ... "
    });
});

chrome.omnibox.onInputChanged.addListener(function (searchText, suggest) {
    
    if (searchText.length>1) {
        chrome.history.search({ text: searchText, startTime: 0 }, function (results) {
            var suggestions = [];
            
            var limit = 15; // Limits the total number of results in the omnibox to this.. should help with performance when dealing with long lists
            if(results.length<limit) limit = results.length;

            var titleLimit = 80; // Limits the page titles to this number of characters when displayed in the omnibox

            // Loop over history results & format them into suggestions for the omnibox to display
            for(var i=0; i<results.length; i++) {
                results.forEach(function (result) {
                    if(result.title.length>1) {
                        suggestions.push({
                            content: result.url, 
                            description: addMatches(xmlEncode(limitText(result.title, titleLimit)), searchText) + ' - <url>' +addMatches(xmlEncode(tidyUrl(result.url)), searchText)+'</url>', 
                            deletable: false });
                    }
                });
            }

            // Display the suggestions from browse history
            suggest(suggestions);
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

// Bold any matching search words found in the suggestions
function addMatches(text, searchText) {
    var searchSplit = searchText.split(' ');

    for(var i=0; i<(searchSplit.length); i++) {
        if(searchSplit[i].length>1) {
            var regEx = new RegExp(searchSplit[i], "ig");
            text = text.replace(regEx, '<match>'+searchSplit[i]+'</match>');
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

