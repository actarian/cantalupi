/**
 * @license cantalupi v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

'use strict';

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var NODE = typeof module !== 'undefined' && module.exports;
var PARAMS = NODE ? {
  get: function get() {}
} : new URLSearchParams(window.location.search);
var DEBUG =  PARAMS.get('debug') != null;
var BASE_HREF = NODE ? null : document.querySelector('base').getAttribute('href');
var DEVELOPMENT = NODE ? false : window && ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
var Environment = /*#__PURE__*/function () {
  _createClass(Environment, [{
    key: "href",
    get: function get() {
      if (window.location.host.indexOf('herokuapp') !== -1) {
        return 'https://raw.githubusercontent.com/actarian/cantalupi/master/docs/';
      } else {
        return BASE_HREF;
      }
    }
  }, {
    key: "host",
    get: function get() {
      var host = window.location.host.replace('127.0.0.1', '192.168.1.2');

      if (host.substr(host.length - 1, 1) === '/') {
        host = host.substr(0, host.length - 1);
      }

      return window.location.protocol + "//" + host + BASE_HREF;
    }
  }]);

  function Environment(options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  return Environment;
}();
var environment = new Environment({
  port: 5000
});

var express = require('express');

var https = require('https');

var fs = require('fs');

var bodyParser = require('body-parser');

var serveStatic = require('serve-static');

var path = require('path');
var PORT = process.env.PORT || environment.port;
var app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '../../docs/')));
app.use('/cantalupi', serveStatic(path.join(__dirname, '../../docs/')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '../../docs/index.html'));
});
app.listen(PORT, function () {
  console.log("Listening on " + PORT);
});
//# sourceMappingURL=main.js.map
