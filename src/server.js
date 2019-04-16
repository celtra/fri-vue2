'use strict';

var Gun = require('gun');
var http = require('http');

var server = http.createServer((req,res) => {
    if (!Gun.serve(req, res)) {
        res.writeHead(200);
        res.end('');
    }
}).listen(process.env.PORT || 5001);

var gun = Gun({ file: 'db/data2.json', web: server, radisk: false, localStorage: true });
