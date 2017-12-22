var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  console.log('Request with method: ' + req.method + ' and url: ' + req.url);
  // GET request
  if (req.method === 'GET') {
    if (req.url === '/') {  // initial
      httpHelpers.serveAssets(res, '/index.html', null, archive.paths.siteAssets);  // upload index.html   
    } else if (req.url === '/styles.css') {
      httpHelpers.serveAssets(res, req.url, null, archive.paths.siteAssets);  // upload styles.css
    } else {
      // we should GET from archived
      httpHelpers.serveAssets(res, req.url, null, archive.paths.archivedSites);
    }
  } else {  // POST request
    var requestedUrl = '';
    // receive url from user
    req.on('data', (chunk) => {
      requestedUrl += chunk.toString();
    });
    
    req.on('end', () => {
      requestedUrl = requestedUrl.split('=')[1];
      console.log('url is: ' + requestedUrl);

      archive.isUrlInList(requestedUrl, (boolean) => {
        if (boolean) {  // url is on sites.txt
          archive.isUrlArchived(requestedUrl, (boolean) => {
            if (boolean) {
              console.log(requestedUrl);
              httpHelpers.serveAssets(res, requestedUrl, null, archive.paths.archivedSites + '/'); // getting from archivedSites
            } else {
              httpHelpers.serveAssets(res, '/loading.html', null, archive.paths.siteAssets);
            }
          });
        } else {
          archive.addUrlToList(requestedUrl, (err) => {
            if (err) {
              res.writeHead(404, httpHelpers.headers);
              res.end();
            } else {
              httpHelpers.serveAssets(res, '/loading.html', null, archive.paths.siteAssets);
            }
          });
        }
      });
    });

  }
};

