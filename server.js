const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var net = require('net');
var WebSocketServer = require('websocket').server;
const port = process.argv[2] || 9000;

//http server ---
// maps file extention to MIME types
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};

//----------------------------------------------------------------------------------------------------
// special in memory directory containing machine state
const stateDir = 'state';
var layerCount = 0;

var hServer = http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  const dir = __dirname+"/dist";
  let pathname = path.join(dir, sanitizePath);

  //get root dir of the url and check if it's in memory on on disk.
  var firstDir = sanitizePath;
  firstDir.toLowerCase();

  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory, then look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);

//--- web socket server
wsServer = new WebSocketServer({
	httpServer: hServer
});

let wsconnection;
wsServer.on('request', function (request) {
	wsconnection = request.accept(null, request.origin);

	wsconnection.on('message', function (event) {
		console.log('Received Message: ', event.binaryData);
	});

	wsconnection.on('close', function (reasonCode, description) {
		console.log('client disconnect');
		wsconnection = null;
	});
});

function processMsg(msg)
{
  console.log("buffer size " + msg.length);
  if(wsconnection != undefined){
	  wsconnection.send(msg);
  }
}