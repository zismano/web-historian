// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

var notArchived = []; // store files not archived yet

// function is declared and invoked immediately
archive.readListOfUrls((urls) => {  // get list of urls from site.txt
  for (var i = 0; i < urls.length; i++) { // for each url
    archive.isUrlArchived(urls[i], (boolean) => { 
      if (!boolean) { // if url isn't archived
        notArchived.push(urls[i]);  // store url
      }
    });
  }
  console.log(notArchived);
  archive.downloadUrls(notArchived);  // download htmls of non-archived urls
});
