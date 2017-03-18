
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;

var stdio = require('stdio');


var options = stdio.getopt({
    'key': { key: 'k', description: 'Shared access key', mandatory: true, args: 1, },
    'device': { key: 'd', description: 'Device id', mandatory: true, args: 1, },
    'hostname': { key: 'h', description: 'Hostname', mandatory: true, args: 1, },
    'name': { key: 'n', description: 'Device name', mandatory: true, args: 1, },
});

var connectionString = 'HostName=' + options.hostname + ';DeviceId=' + options.device + ';SharedAccessKey=' + options.key;

var client = Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('could not open IotHub client');
    } else {
        console.log('client opened');

        client.getTwin(function (err, twin) {
            if (err) {
                console.error('could not get twin');
            } else {
                console.dir(twin.properties);
                var patch = {
                    connectivity: {
                        type: 'cellular',
                    },
                };

                twin.properties.reported.update(patch, function (err) {
                    if (err) {
                        console.error('could not update twin');
                    } else {
                        console.log('twin state reported');
                        process.exit();
                    }
                });
            }
        });
    }
});