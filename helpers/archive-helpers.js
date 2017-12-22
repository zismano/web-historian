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
  fs.readFile(exports.paths.list, (err, data) => {  // read sites.txt file
    if (err) {
      throw err;
    } else {
      var links = data.toString().split('\n');  // split data by lines and store in links array
      callback(links);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(links) {  // get links stored in sites.txt
    callback(links.includes(url));  // callback on if url is found in links boolean
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {  // add url to sites.txt
    callback(err);
  });
};

exports.isUrlArchived = function(url, callback) {
  callback(fs.existsSync(exports.paths.archivedSites + '/' + url)); // callback on if url is archived ]boolean
};

exports.downloadUrls = function(urls) {
  for (let i = 0; i < urls.length; i++) { // use let in order to declare block scope local (in particular because we use inside the loop async functions)
    request('http://' + urls[i], function (error, response, body) { // receives html body of a url. simplest way to make http calls. It supports HTTPS and follows redirects by default.
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      console.log('url is: ' + urls[i]);
      fs.writeFile(exports.paths.archivedSites + '/' + urls[i], body, (err) => {  // writing new archived files with html body received
        if (err) { 
          console.log('Error while writing file');
          throw err;
        }
        console.log('The file has been saved!');
      });
    });
  }
};
