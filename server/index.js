var http = require('http');
var path = require('path');
var fs = require('fs');

var stat = require('node-static');
var busboy = require('busboy');

http.createServer(function(req, res) {
    if(req.method === 'POST') {
        var busser = new busboy({ headers: req.headers });
        busser.on('file', function(fieldname, file, filename, encoding, mimetype) {
            if(mimetype !== 'image/gif') {
                res.writeHead(400);
                res.end();
            } else {
                fs.mkdirSync(__dirname + '/uploads');
                var pathName = __dirname + '/uploads/' + new Date().getTime() + '.gif';
                file.pipe(fs.createWriteStream(pathName));
            }
        });
        busser.on('finish', function() {
            res.writeHead(200);
            console.log('wrote file');
            res.end();
        });
        return req.pipe(busser);
    } else if(req.method === 'GET') {
        if(req.headers.accept.match(/text\/html/g)) {
            fs.readFile('./index.html', 'binary', function(err, file) {
                if(err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end();
                } else {
                    console.log('sent index.html');
                    res.writeHead(200);
                    res.write(file);
                    res.end();
                }
            });
        } else if(req.headers.accept.match(/application\/json/g)) {
            res.writeHead(200);
            console.log('json response');
            var dir = fs.readdirSync('./uploads');
            var returns = [];
            for(var i = dir.length - 1; i >= 0 && i > dir.length - 10; i--) {
                returns.push(dir[i]);
            }
            res.write(JSON.stringify(returns));
            res.end();
        } else {
            res.writeHead(404);
            console.log('invalid req');
            res.end();
        }
    }
}).listen(8888, function() {
    console.log('server alive on 8888');
});