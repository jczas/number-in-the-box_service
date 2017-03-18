
var iothub = require('azure-iothub');

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

var registry = iothub.Registry.fromConnectionString(connectionString);

registry.getTwin(targetDevice, function (err, twin) {
    if (err) {
        console.error(err.constructor.name + ': ' + err.message);
    } else {
        var patch = {
            tag: {
                location: {
                    region: 'US',
                    plant: 'Redmond43',
                    city: 'Wroclaw',
                },
            },
        };

        twin.update(patch, function (err) {
            if (err) {
                console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
            } else {
                console.log(twin.deviceId + ' twin updated successfully');
                queryTwins();
            }
        });
    }
});

var queryTwins = function () {
    var query = registry.createQuery('SELECT * FROM devices', 100);
    query.nextAsTwin(function (err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            console.log('Devices in Redmond43: ' + results.map(function (twin) { return twin.deviceId; }).join(','));
        }
    });

    query = registry.createQuery('SELECT * FROM devices', 100);
    query.nextAsTwin(function (err, results) {
        if (err) {
            console.error('Failed to fetch the results: ' + err.message);
        } else {
            console.log('Devices in Redmond43 using cellular network: ' + results.map(function (twin) { return twin.deviceId; }).join(','));
        }
    });
};

