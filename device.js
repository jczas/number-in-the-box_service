var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var stdio = require('stdio');


var options = stdio.getopt({
    'key': { key: 'k', description: 'Shared access key', mandatory: true, args: 1, },
    'device': { key: 'd', description: 'Device id', mandatory: true, args: 1, },
    'hostname': { key: 'h', description: 'Hostname', mandatory: true, args: 1, },
    'name': { key: 'n', description: 'Device name', mandatory: true, args: 1, },
});

var connectionString = 'HostName=' + options.hostname + ';DeviceId=' + options.device + ';SharedAccessKey=' + options.key;

console.log('Connection string: ' + connectionString);

var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

client.open(function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');
        client.on('message', function (msg) {
            console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
            client.complete(msg, printResultFor('completed'));
        });
        // Create a message and send it to the IoT Hub every second
        //  setInterval(function(){
        //      var windSpeed = 10 + (Math.random() * 4);
        //      var data = JSON.stringify({ deviceId: 'myFirstNodeDevice', windSpeed: windSpeed });
        //      var message = new Message(data);
        //      console.log("Sending message: " + message.getData());
        //      client.sendEvent(message, printResultFor('send'));
        //  }, 1000);
    }
});
