
const request = require('request');
const parseString = require('xml2js').parseString;

module.exports = {
    /**
     * get parking info from service and give it to the function okCallback
     * @param okCallback will be called, if data was get from serice, 
     *        param: associative array with keys: timestamp, spaces, occupied, free
     * @param errorCallback will be called, if error occures, 
     *        param: error
     */
    getParkingInfo: function (okCallback, errorCallback) {
        const url = 'http://parking.descont.pl/parking.xml';

        request(url, function (error, response, xml) {
            if (error) {
                errorCallback(error);
            } else {
                parseString(xml, function (error, result) {
                    if (error) {
                        errorCallback(error);
                    } else {
                        okCallback({
                            timestamp: result.ParkPollGroups['$'].timestamp,
                            spaces: result.ParkPollGroups.Group[0]['$'].spaces,
                            occupied: result.ParkPollGroups.Group[0]['$'].occupied,
                            free: result.ParkPollGroups.Group[0]['$'].free,
                        });
                    }
                });
            }
        });
    },
};