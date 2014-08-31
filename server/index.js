var http = require('http');
var path = require('path');
var fs = require('fs');

http.createServer(function(req, res) {
    if(req.method === 'POST') {
        if(!fs.existsSync(__dirname + '/uploads')) fs.mkdirSync(__dirname + '/uploads');
        var pathName = __dirname + '/uploads/' + new Date().getTime() + '.gif';
        var dest = fs.createWriteStream(pathName);
        req.pipe(dest);
        req.on('end', function() {
            res.writeHead(200);
            res.end();
        });
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