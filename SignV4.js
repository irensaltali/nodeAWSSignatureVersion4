const sha256 = require("js-sha256");
const v4 = require('aws-signature-v4');
const fs = require("fs");

class SignV4 {
    SignFirehosePostPutRecord(date, uri, payload, AWSAccessKey, AWSSecret, Region) {
        let service = "firehose";

        //Canonical Request
        let HTTPMethod = "POST" + "\n";
        let CanonicalURI = uri.pathname + "\n";
        let CanonicalQuerystring = "" + "\n";
        let CanonicalHeaders = "host:" + uri.hostname + "\n"
            + "x-amz-date:" + this.yyyyMMddTHHmmssZ(date) + "\n"
            + "x-amz-target:Firehose_20150804.PutRecord\n";
        let SignedHeaders = "host;x-amz-date;x-amz-target";
        let HashedPayload = sha256(payload);

        var CanonicalRequest = HTTPMethod + CanonicalURI + CanonicalQuerystring + CanonicalHeaders + "\n" + SignedHeaders + "\n" + HashedPayload;

        //StringToSign
        let StringToSignStart = "AWS4-HMAC-SHA256" + "\n";
        let TimeStamp = this.yyyyMMddTHHmmssZ(date) + "\n";
        let Scope = this.yyyyMMdd(date) + "/" + Region + "/" + service + "/aws4_request" + "\n";

        var StringToSign = StringToSignStart + TimeStamp + Scope + sha256(CanonicalRequest);

        //Signature
        var signature = v4.createSignature(AWSSecret, date, Region, service, StringToSign);

        //AuthorizationHeader
        let AuthorizationHeader = "AWS4-HMAC-SHA256 Credential=" + AWSAccessKey + "/" + this.yyyyMMdd(date) + "/" + Region + "/" + service + "/aws4_request,"
            + " SignedHeaders=" + SignedHeaders + ", Signature=" + signature;

        return AuthorizationHeader;
    }
    SignFirehosePostPutRecordBatch(date, uri, payload, AWSAccessKey, AWSSecret, Region) {
        let service = "firehose";

        //Canonical Request
        let HTTPMethod = "POST" + "\n";
        let CanonicalURI = uri.pathname + "\n";
        let CanonicalQuerystring = "" + "\n";
        let CanonicalHeaders = "host:" + uri.hostname + "\n"
            + "x-amz-date:" + this.yyyyMMddTHHmmssZ(date) + "\n"
            + "x-amz-target:Firehose_20150804.PutRecordBatch\n";
        let SignedHeaders = "host;x-amz-date;x-amz-target";
        let HashedPayload = sha256(payload);

        var CanonicalRequest = HTTPMethod + CanonicalURI + CanonicalQuerystring + CanonicalHeaders + "\n" + SignedHeaders + "\n" + HashedPayload;

        //StringToSign
        let StringToSignStart = "AWS4-HMAC-SHA256" + "\n";
        let TimeStamp = this.yyyyMMddTHHmmssZ(date) + "\n";
        let Scope = this.yyyyMMdd(date) + "/" + Region + "/" + service + "/aws4_request" + "\n";

        var StringToSign = StringToSignStart + TimeStamp + Scope + sha256(CanonicalRequest);

        //Signature
        var signature = v4.createSignature(AWSSecret, date, Region, service, StringToSign);

        //AuthorizationHeader
        let AuthorizationHeader = "AWS4-HMAC-SHA256 Credential=" + AWSAccessKey + "/" + this.yyyyMMdd(date) + "/" + Region + "/" + service + "/aws4_request,"
            + " SignedHeaders=" + SignedHeaders + ", Signature=" + signature;

        return AuthorizationHeader;
    }

    yyyyMMddTHHmmssZ(now) {
        var y = now.getUTCFullYear();
        var M = now.getUTCMonth() + 1;
        var d = now.getUTCDate();
        var h = now.getUTCHours();
        var m = now.getUTCMinutes();
        var s = now.getUTCSeconds();
        var MM = M < 10 ? '0' + M : M;
        var dd = d < 10 ? '0' + d : d;
        var hh = h < 10 ? '0' + h : h;
        var mm = m < 10 ? '0' + m : m;
        var ss = s < 10 ? '0' + s : s;
        return '' + y + MM + dd + "T" + hh + mm + ss + "Z";
    }

    yyyyMMdd(now) {
        var y = now.getUTCFullYear();
        var m = now.getUTCMonth() + 1;
        var d = now.getUTCDate();
        var mm = m < 10 ? '0' + m : m;
        var dd = d < 10 ? '0' + d : d;
        return '' + y + mm + dd;
    }

    toUTF8Array(str) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }
}

module.exports = SignV4;