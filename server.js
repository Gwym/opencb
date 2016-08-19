"use strict"

var fs = require('fs');
var http = require('http');
var WebSocketServer = require('ws').Server;


//  Set the constants we need.
var env = {
	protocol: 'yh001'
}


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

console.log('mongoURL :' + mongoURL + ' ' + process.env.DATABASE_SERVICE_NAME);
console.log('server :' + ip + ' ' + port);

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {

  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
    mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  }
  else {
    console.warn('MongoDB configuration error ' + mongoHost + ' ' + mongoPort + ' ' + mongoDatabase);
  }
}


var toStr = function (o) {
	var o_str = '';
	for (var k in o) {
		// o_str += typeof o[k] + ' \n';
		if (typeof o[k] === 'function') {
			// o_str += k + ' : ' + ('' + o[k]).substring(0,10) + ' \n';
		}
		else {
			o_str += k + ' : ' + o[k] + ' \n';
		}
	}
	return o_str;
}


var db = null,
  dbDetails = new Object();

var initDb = function (callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function (err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};


initDb(function (err) {
  console.log('Error connecting to Mongo. Message:\n' + err);
});

// index page
var html = fs.readFileSync('views/index.html');

var server = http.createServer(function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);

}).listen(port, ip);
console.log('%s: Node server started on %s:%d',
  Date(Date.now()), ip, port);



// cf. OPENSHIFT doc : plain WebSockets ws:// will use port 8000 and secured connections wss:// port 8443


var wss = new WebSocketServer(
  { server: server }
  , function () {
    console.log('WS > listen callback ');
  });

// TODO (0) : hash passwords, rolling id, mongo datastore
var datastore = {
  user: {
    test1: {
      pwd: 'test1',
      name: 'Test1'
    }
  }
}

wss.on('connection', function (ws) {

  if (ws.protocol !== env.protocol) {
    console.log('WS > bad protocol, closing ' + toStr(ws));

    ws.close();
    return;
  }

  // console.log('WS > connection ' + toStr(ws));
  console.log('WS > clients ' + wss.clients.length); // + ' ' + toStr(wss.clients[0]));

  ws.once('message', function (message) {

    console.log('WS auth > received: %s', message);

    var u;

    try {

      u = JSON.parse(message);

      console.log(u);

      // check user id/pwd
      if (u.seq === 0 && u.pwd === datastore.user[u.id].pwd) {

        ws.userID = u.id;
        ws.on('message', function (message) {

          try {

            u = JSON.parse(message);
            console.log('WS > received: %s on %s', u, ws.userID);
            // dispatch(user[ws.userID]) or ws.dispatch( ?=)

          }
          catch (e) {
            console.log('WS > error ' + e + ', closing ' + toStr(ws));
            ws.close();
          }

        });

        console.log('User  ' + u.id + ' connected');
        ws.send('welcome ' + datastore.user[u.id].name);

      }
      else {
        console.log('WS > wrong id or password ' + toStr(u) + ', closing ' + toStr(ws));
        ws.close();
      }

    }
    catch (e) {
      console.log('WS auth > error ' + e + ', closing ' + toStr(ws));
      ws.close();
    }

  }); // auth once

  ws.send('who?');
});


/*

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
*/
