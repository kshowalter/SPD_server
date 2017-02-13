var express = require('express');
var http = require('http');
var port = process.env.PORT || '3300';

// Start express app
var app = express();

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);

// Add routes
app.get('/', function (req, res) {
  res.send('Nothing here. Try /drawing/[system id.]');
});
var router_d = require('./route/drawing.js');
app.use('/d', router_d);

console.log('server started on http://localhost:'+port);
