var express = require('express');
var crypto = require('crypto');

var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});


app.post('/ud', function(req, res) {            
  for(var key in req.body) {
    console.log(key+' - ' +req.body[key]);
  }
    
  var mode = req.body['openid.mode'];
  if (mode == 'associate') {
    res.send(200,'mac_key:dGVzdDEyMw=='); // test123
  }
    //res.send(200,'mac_key:test123');
    //console.log(JSON.stringify(req.body));    
});

app.get('/ud', function(req, res) {
  console.log('get /ud');    
  for(var key in req.query) {
    console.log(key+' - ' +req.query[key]);
  }
  
  
  
  
  
  
  //hmac.update(message, 'utf8');
  //var ourSignature = hmac.digest('base64');
  
  
  var mode = req.query['openid.mode'];
  if(mode == 'checkid_setup') {
    
    var message = 'op_endpoint'+':'+'http://localhost:3001/ud' +'\n';
    message += 'claimed_id'+':'+'http://localhost:3001/?id=test_pk' +'\n';
    message += 'identity'+':'+'http://localhost:3001/?id=test_pk' +'\n';
    message += 'return_to'+':'+req.query['openid.return_to']+'\n';
    
    var hmac = crypto.createHmac('sha1', 'test123');  
    hmac.update(message, 'utf8');            
    
    
    urlStr = req.query['openid.return_to'] + '?' +
      'openid.ns=http://specs.openid.net/auth/2.0'+
      '&openid.mode=id_res'+
      '&openid.return_to='+req.query['openid.return_to']+
      '&openid.op_endpoint=http://localhost:3001/ud'+
      '&openid.sig='+hmac.digest('base64')+
      '&openid.signed=op_endpoint,claimed_id,identity,return_to'+
      '&openid.identity=http://localhost:3001/?id=test_pk'+
      '&openid.claimed_id=http://localhost:3001/?id=test_pk';      
    res.redirect(urlStr);
  }
});

app.get('/', function(req, res) {
  res.charset = 'value';
  res.set('Content-Type', 'application/xrds+xml');
  var xrds = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<xrds:XRDS xmlns:xrds="xri://$xrds" xmlns="xri://$xrd*($v*2.0)">'+
    '<XRD>'+
    '<Service priority="0">'+
    '<Type>http://specs.openid.net/auth/2.0/server</Type>'+
    // '<URI>https://www.google.com/accounts/o8/ud</URI>'+
    '<URI>http://localhost:3001/ud</URI>'+
    '</Service>'+
    '</XRD>'+
    '</xrds:XRDS>';      
  res.send(xrds);
});


app.listen(3001);
