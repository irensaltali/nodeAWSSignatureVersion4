const request = require("request");
const fs = require("fs");
const SignV4 = require("./SignV4.js");
var signV4 = new SignV4();


var file = fs.readFileSync("AWS.key", "UTF-8");
var AWSAccessKey = file.split(',')[0];
var AWSSecret = file.split(',')[1];
var uri = new URL('', 'https://firehose.eu-west-1.amazonaws.com');
var Region = "eu-west-1";
var date = new Date();

PutRecord();
PutRecords();

function PutRecord() {
    var data = JSON.stringify({
        test: 'tesdata'
    });
    var buff = new Buffer(data);
    var base64data = buff.toString('base64');
    var payload = JSON.stringify({
        DeliveryStreamName: 'i4io-log-test-2',
        Record: {
            Data: base64data
        }
    });


    var authHeader = signV4.SignFirehosePostPutRecord(date, uri, payload, AWSAccessKey, AWSSecret, Region);


    var options = {
        url: 'https://firehose.eu-west-1.amazonaws.com',
        headers: {
            "host": uri.hostname,
            "x-amz-date": signV4.yyyyMMddTHHmmssZ(date),
            "x-amz-target": "Firehose_20150804.PutRecord",
            "Authorization": authHeader,
            "Content-Type": "application/x-amz-json-1.1",
            "Content-Length": Buffer.byteLength(payload, 'utf8'),
            "Connection": "Keep-Alive"
        },
        body: payload
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("200");
            var info = JSON.parse(body);
            console.log(info);
            console.log(body);
        }
        console.log(error);
        console.log(body);
    }

    request.post(options, callback);
}

function PutRecords() {
    var payloadData = {
        DeliveryStreamName: 'i4io-log-test-2',
        Records: []
    };

    var buff = new Buffer("");
    for (i = 0; i < 10; i++) {
        console.log(i);
        var data = JSON.stringify({
            test: 'tesdata' + i
        });
        buff = Buffer.from(data);
        var base64data = buff.toString('base64');

        payloadData.Records.push({
            Data: base64data
        })
    }

    var payload = JSON.stringify(payloadData);
    console.log(payload);




    var authHeader = signV4.SignFirehosePostPutRecordBatch(date, uri, payload, AWSAccessKey, AWSSecret, Region);


    var options = {
        url: 'https://firehose.eu-west-1.amazonaws.com',
        headers: {
            "host": uri.hostname,
            "x-amz-date": signV4.yyyyMMddTHHmmssZ(date),
            "x-amz-target": "Firehose_20150804.PutRecordBatch",
            "Authorization": authHeader,
            "Content-Type": "application/x-amz-json-1.1",
            "Content-Length": Buffer.byteLength(payload, 'utf8'),
            "Connection": "Keep-Alive"
        },
        body: payload
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("200");
            var info = JSON.parse(body);
            console.log(info);
            console.log(body);
        }
        console.log(error);
        console.log(body);
    }

    request.post(options, callback);
}