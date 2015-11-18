var request = require('request');
var fs = require('fs');

request('http://192.168.10.110:9989/onvif/media_service/snapshot').pipe(fs.createWriteStream('doodle.jpeg'));
