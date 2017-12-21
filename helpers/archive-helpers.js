var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) {
      throw err;
    } else {
      var links = data.toString().split('\n');
      callback(links);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(links) {
    callback(links.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    callback(err);
  });
};

exports.isUrlArchived = function(url, callback) {
  callback(fs.existsSync(exports.paths.archivedSites + '/' + url));
};

exports.downloadUrls = function(urls) {
  for (let i = 0; i < urls.length; i++) {
    request('http://' + urls[i], function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      console.log('url is: ' + urls[i]);
      fs.writeFile(exports.paths.archivedSites + '/' + urls[i], body, (err) => {
        if (err) { 
          console.log('Error while writing file');
          throw err;
        }
        console.log('The file has been saved!');
      });
    });
  }
};
