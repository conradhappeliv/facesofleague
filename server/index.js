var http = require('http');
var path = require('path');
var fs = require('fs');

var Busboy = require('busboy');
var stat = require('node-static');
var express = require('express');
var app = express();

var fileServer = new stat.Server();

var waitingClients = [];

app.post('/', function(req, res) {

    var dt = new Date().getTime();
    var pathName = __dirname + '/uploads/' + dt + '.gif';
    // upload gif
    var busser = new Busboy({headers:req.headers});
    busser.on('file', function(fieldname, file, filename, encoding, mimetype) {
        if(!fs.existsSync(__dirname + '/uploads')) fs.mkdirSync(__dirname + '/uploads');
        file.pipe(fs.createWriteStream(pathName));

    });
    busser.on('finish', function() {
        res.writeHead(200);
        res.end();
        for(var i = 0; i < waitingClients.length; i++) {
            var c = waitingClients.pop();
            c.write(JSON.stringify([dt + '.gif']));
            c.end();
        }
    });
    return req.pipe(busser);
});

app.get('/gifs', function(req, res) {
    var files = fs.readdirSync('./uploads');
    if(req.url.match(files[files.length-1])) {
        waitingClients.push(res);
    } else {
        // send image paths
        res.writeHead(200);
        console.log('json response');
        var dir = fs.readdirSync('./uploads');
        var returns = [];
        for(var i = dir.length - 1; i >= 0 && i > dir.length - 10; i--) {
            returns.push(dir[i]);
        }
        res.write(JSON.stringify(returns));
        res.end();
    }
});

app.get('/uploads/*', function(req, res) {
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
});

app.get('/', function(req, res) {
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
});

app.listen(8888, function() {
    console.log('server alive on port 8888');
});