'use strict';
var fs = require('fs');
var request = require('request');
var FILE_PROTOCOL_RE = /file:\/\//;
var FILE_RE = process.platform == 'win32' ? /^[a-z]:[\/\\]/i : /^\/[^\/*]/;
var TIMEOUT = 3000;

function loadScript(options, cb) {
  if (typeof options === 'string') {
    options = {url: options};
  }
  options.timeout = options.timeout || TIMEOUT;
  
  switch(getUrlType(options.url)) {
    case 'HTTP':
      request(options, function(err, res, body) {
        cb(err, body);
      });
      break;
    case 'FILE':
        fs.readFile(options.url, {encoding: 'utf8'}, cb);
      break;
    default: 
      cb(null, options.url);
  }
}

function getUrlType(url) {
  if (/^https?:\/\//.test(url)) {
    return 'HTTP';
  }
  
  if (FILE_PROTOCOL_RE.test(url) || FILE_RE.test(url)) {
    return 'FILE';
  }
  
  return 'TEXT';
}

module.exports = loadScript;

