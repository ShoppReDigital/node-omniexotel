const { log } = console;

const parser = require('xml2json');
const rp = require('request-promise');

module.exports = {
    removeNumberFromDnd(Number) {
        return rp({
            method: 'POST',
            uri: `https://${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/CustomerWhitelist/`,
            formData: { VirtualNumber: process.env.EXOTEL_VIRTUAL_NUMBER, Number, Language: 'en' },
            json: true,
        })
            .then(result => JSON.parse(parser.toJson(result)).TwilioResponse.Result.Message);
    },

    getCallDetails(CallSid) {
        return rp({
            method: 'GET',
            uri: `https://${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/Calls/${CallSid}.json`,
            json: true,
        })
            .then(res => Promise.resolve(res))
            .catch(err => log('EXOTEL_FETCH_CALL_DETAILS_FAILED', err));
    },

    removeNumbersFromDnd(numbers) {
        return Promise.all(numbers.map(number => this.removeNumberFromDnd(number)));
    },

    async connect(customerMobileNumber, agentMobileNumber, exotelPhoneNumber) {
        log('EXOTEL_API_CALLED_CALL_USER_FROM_OPERATOR', toContactNumber, fromContactNumber);
        await this.removeNumbersFromDnd([toContactNumber, fromContactNumber]);
        try {
            const response = await rp({
                method: 'POST',
                uri: `https://${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/Calls/connect`,
                formData: {
                    From: agentMobileNumber,
                    To: customerMobileNumber,
                    CallerId: exotelPhoneNumber,
                    CallType: 'trans',
                },

                json: true,
            });
            return response;
        } catch (err) {
            // console.log('exotel call failed', err);
            return err.message;
        }
    },

    async callUserFromDoctor(userContactNumber, doctorAppid, callerId) {
        log('EXOTEL_API_CALLED_CALL_USER_FROM_DOCTOR', userContactNumber);
        await this.removeNumberFromDnd(userContactNumber);
        try {
            await rp({
                method: 'POST',
                uri: `https://${process.env.EXOTEL_SID}:${process.env.EXOTEL_TOKEN}@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/Calls/connect`,
                formData: {
                    From: userContactNumber,
                    CallerId: callerId,
                    Url: `http://my.exotel.com/exoml/start/${doctorAppid}`,
                    CallType: 'trans',
                },
                json: true,
            });
        } catch (err) {
            log('exotel call failed', err);
        }
    },
};


