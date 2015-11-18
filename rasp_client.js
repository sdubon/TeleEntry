const device = { identifier: '00001' }

const settings = require('./settings_client_teleentry.json')

var HTTP_HOST = '104.131.0.237'
var HTTP_PORT = 8080
var CLIENT_HTTP_PORT = 8081

if (settings.DEBUG == true){
  HTTP_HOST = 'localhost'
}

const socket = require('socket.io-client')('http://' + HTTP_HOST + ':'+ HTTP_PORT +'/devicecommand')
const app = require('http').createServer(http_server)
const fs = require('fs')
const url = require('url')
const request = require('request');
const dl = require('delivery');

// ================================== SOCKET.IO (BEGIN) ==========
socket.on('connect', function(data){
  console.log('connected !')
  socket.emit('client_begin_conection', { identifier: device.identifier })
})

socket.on('reconnect', function(number){
  console.log("Reconnected :) ...", number)
  socket.emit('client_begin_conection', { identifier: device.identifier })
})

socket.on('disconnect', function(){
  console.log('Disconected :( ....')
})

socket.on('welcome', function(data){
  console.log(data)
})

socket.on('SAVE', function(data){
  if (data.identifier == device.identifier){
    console.log("==============   SAVE OK", data)
    socket.emit('SAVE_OK', data)
  }
})

socket.on('DELETE', function(data){
  console.log("DELETE", data)
})

socket.on('CHECK_CODE_OK', function(data){
  console.log("CHECK_CODE_OK", data)
})

socket.on( 'ReadImage', function() {
  request('http://192.168.10.110:9989/onvif/media_service/snapshot').pipe(fs.createWriteStream('doodle.jpeg'));
        
  delivery = dl.listen( socket );
  delivery.connect();
    
  delivery.on('delivery.connect',function(delivery){
    delivery.send({
      name: 'doodle.jpeg',
      path : './doodle.jpeg'
    });
 
    delivery.on('send.success',function(file){
      console.log('File sent successfully!');
    });
  });   
});

// ================================== SOCKET.IO (END) ==========

// ================================== HTTP SERVER (BEGIN) ==========
app.listen(CLIENT_HTTP_PORT)

function http_server(req, res){

  const url_parsed = url.parse(req.url, true)

  // =========== Monitor
	if (url_parsed.pathname == '/'){
    console.log('index')
    fs.readFile(__dirname + '/client_00001.html',
      function(err, data){
        res.writeHead(200)
        res.end(data)
      })
  }

  if (url_parsed.pathname == '/checkcode'){
    console.log("Checking code ... ", url_parsed.code)
    res.write("Checking code ... \n")
    socket.emit('CHECK_CODE',
      { identifier: device.identifier, code: url_parsed.query.code},
      function(data){
        res.end("CHECK_CODE => " + JSON.stringify(data))
      })
  }
}
// ================================== HTTP SERVER (END) ==========
