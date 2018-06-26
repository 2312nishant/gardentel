'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;


var connectionString = 'HostName=SATHUBDEMO.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=w9LoDswGW0jqnGjCOFOUH0AKoTnqZLYBcoceO7AK86Y=';
var targetDevice = 'D8B04CB90DC8';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}
serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
    serviceClient.getFeedbackReceiver(receiveFeedback);
    var message = new Message('{"Name":"Play","Parameters":{"Data":"MTAwVkFMVkVPTiAwMDEgQ0M="}}');
   // message.ack = 'full';
    //message.messageId = "My Message ID";
    console.log('Sending message: ' + message.getData());
    serviceClient.send(targetDevice, message,   ('send'));
  }
});

