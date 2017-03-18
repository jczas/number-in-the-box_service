
const Client = require('azure-iothub').Client;
const Message = require('azure-iot-common').Message;

const stdio = require('stdio');

const parking = require('../modules/parking');

const options = stdio.getopt({
    'connection': {
        key: 'c',
        description: 'Connection string',
        mandatory: true,
        args: 1,
    },
    'device': {
        key: 'd',
        description: 'Device id',
        mandatory: true,
        args: 1,
    },
});

const connectionString = options.connection;
const targetDevice = options.device;

const serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function receiveFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:');
        console.log(msg.getData().toString('utf-8'));
    });
}

var lastResult;

serviceClient.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Service client connected');
        serviceClient.getFeedbackReceiver(receiveFeedback);

        // Create a message and send it to the IoT Hub every second
        setInterval(function () {
            parking.getParkingInfo(function (result) {
                const data = JSON.stringify(result);

                if (result != lastResult) {
                    const message = new Message(data);
                    message.ack = 'full';
                    message.messageId = 'My Message ID';
                    console.log('Sending message: ' + message.getData());
                    console.dir(message.getData());
                    serviceClient.send(targetDevice, message, printResultFor('send'));
                    //          lastResult = result;
                }
            }, function (error) {
                console.error('Error ', error);
            });
        }, 5000);
    }
});
