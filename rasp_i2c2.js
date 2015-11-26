var i2c = require('i2c');
var address1 = 0x18;
var TeleEntry1 = new i2c(address1, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

var sleep = require('sleep');

var i = 0;
var state = 0;
var _ID = ""
var _CODE = ""
var message = ""

//"i=00001&c=9328&a=s"

  //console.log("infinite loop")
setInterval(function(){
  TeleEntry1.readByte(function(err, res) { 
    if (res == '!'.charCodeAt(0) ){
      console.log(message)
      message = ""
      TeleEntry1.writeByte('x'.charCodeAt(0) , function(err) {});
      TeleEntry1.writeByte(res, function(err) {});
    }
    else if (res != '#'.charCodeAt(0) ){
      console.log("Reading Byte data")
      message.concat(String.fromCharCode(res))
      TeleEntry1.writeByte('x'.charCodeAt(0) , function(err) {});
      TeleEntry1.writeByte(res, function(err) {});
    }
    else{
      console.log("Reading Byte #")
    }
  console.log(res)
  });
}, 1000);

/*
  switch(state){
  case 0:
    if (res == 'i'){      //expecting =
      TeleEntry1.writeByte("x", function(err) {});
      TeleEntry1.writeByte(res, function(err) {});
      state = 10
      break
    }
  case 10:
    if (res == '='){      //expecting TeleEntry ID
      TeleEntry1.writeByte("x", function(err) {})
      TeleEntry1.writeByte(res, function(err) {})
      state = 11
      var cont = 0;
      break
    }
    //code.charAt(0); 
  case 11:
    if (res >= '0' && res <= '9'){      //expecting TeleEntry ID
      TeleEntry1.writeByte("x", function(err) {})
      TeleEntry1.writeByte(res, function(err) {})
      _ID.concat(res)  
      cont++
      if (cont == 5){
        state = 20
      }
      
      break
    }
*/
