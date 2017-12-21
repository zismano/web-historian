var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

};

exports.downloadUrls = function(urls) {
  // readListOfUrls => for each link we check if it is not archived  
    // build an http GET request for each url in urls
    // write the result in a new file within archives/sites/ with the name of the url (.html)
};
