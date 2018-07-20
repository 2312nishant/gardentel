// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';


// Connection string for the IoT Hub service
//
// NOTE:
// For simplicity, this sample sets the connection string in code.
// In a production environment, the recommended approach is to use
// an environment variable to make it available to your application
// or use an x509 certificate.
// https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security
//
// Using the Azure CLI:
// az iot hub show-connection-string --hub-name {YourIoTHubName} --output table
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app-log.log' })
  ]
});

logger.info('hey app is running');

var connectionString = 'HostName=SATHUBDEMO.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=w9LoDswGW0jqnGjCOFOUH0AKoTnqZLYBcoceO7AK86Y=';
var deviceId ;
var deviceName ;

// Using the Node.js SDK for Azure Event hubs:
//   https://github.com/Azure/azure-event-hubs-node
// The sample connects to an IoT hub's Event Hubs-compatible endpoint
// to read messages sent from a device.
var { EventHubClient, EventPosition } = require('azure-event-hubs');
//var db = require('./loggingreceiver.js');
var printError = function (err) {
  console.log(err.message);
};

// Display the message content - telemetry and properties.
// - Telemetry is sent in the message body
// - The device can add arbitrary application properties to the message
// - IoT Hub adds system properties, such as Device Id, to the message.
var printMessage = function (message) {
  console.log('Telemetry received: ');
  console.log("commond1"+ JSON.stringify(message.body));
  var data = JSON.parse(JSON.stringify(message.body));
  deviceId = JSON.stringify(data.todevice);
  console.log("todevice "+ JSON.stringify(data.todevice));
  deviceName = JSON.stringify(data.command);
  console.log("deviceName "+ deviceName);
logger.info('logging running1');
if( typeof deviceId!="undefined"){
var targetDevice = JSON.parse(deviceId);;

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}


serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
    serviceClient.getFeedbackReceiver(receiveFeedback);
    var message = new Message(deviceName);
   // message.ack = 'full';
    //message.messageId = "My Message ID";
    console.log('Sending message: ' + message.getData());
    serviceClient.send(targetDevice, message,  printResultFor('send'));
  }
});

function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}
  console.log("command "+ JSON.stringify(data.command));
  console.log('Application properties (set by device): ')
  console.log(JSON.stringify(message.applicationProperties));
  console.log('System properties (set by IoT Hub): ')
  console.log(JSON.stringify(message.annotations));
  console.log('');
}

  //var post  = {temperature: message.body['temperature'], humidity: message.body['humidity']};
  //var query = db.query('INSERT INTO loggingreceiver SET ?', post, function(err, result) {
   //if (err) throw err;
    //console.log("1 record inserted");
 //});

}



// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This example only reads messages sent after this application started.
var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("Successully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
  console.log("The partition ids are: ", ids);
logger.info("The partition ids are ",ids);
  return ids.map(function (id) {
    return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
}).catch(printError);








