var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  console.log('Request with method: ' + req.method + ' and url: ' + req.url);
  if (req.method === 'GET') {
    if (req.url === '/') {  // initial
      httpHelpers.serveAssets(res, '/index.html');   
    } else if (req.url === '/styles.css') {
      httpHelpers.serveAssets(res, req.url);
    } else if (req.url === '/loading.html') {
      httpHelpers.serveAssets(res, req.url);   
    } else {
      // we should GET from archived
    }
  } else {  // POST METHOD
    var requestedUrl = '';
    req.on('data', (chunk) => {
      requestedUrl += chunk.toString();
    });
    
    req.on('end', () => {
      requestedUrl = requestedUrl.split('=')[1];
      console.log('url is: ' + requestedUrl);

      archive.isUrlInList(requestedUrl, (boolean) => {
        if (boolean) { // url is on sites.txt
          archive.isUrlArchived(requestedUrl, (boolean) => {
            if (boolean) {
              // get actual html from archives
            } else {
              httpHelpers.serveAssets(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(requestedUrl, (err) => {
            if (err) {
              res.writeHead(404, httpHelpers.headers);
              res.end();
            } else {
              console.log('appended ' + requestedUrl);
              httpHelpers.serveAssets(res, '/loading.html');
            }
          });
        }
      });
    });

  }
};

