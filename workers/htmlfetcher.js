// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

// require our archive helpers
// empty temporary array to check which urls we need to actually download
// function that downloads the new ones creating new htmls
var archive = require('../helpers/archive-helpers');

var notArchived = [];

var fetcher = () => {
  archive.readListOfUrls((urls) => {
    for (var i = 0; i < urls.length; i++) {
      archive.isUrlArchived(urls[i], (boolean) => {
        if (!boolean) {
          notArchived.push(urls[i]);
        }
      });
    }
    console.log(notArchived);
    archive.downloadUrls(notArchived);
  });  
};

// fetcher();