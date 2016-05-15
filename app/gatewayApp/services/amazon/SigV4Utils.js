/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('SigV4Utils', function () {


    function SigV4Utils(){}

        SigV4Utils.sign = function(key, msg){
            var hash = CryptoJS.HmacSHA256(msg, key);
            return hash.toString(CryptoJS.enc.Hex);
        };

        SigV4Utils.sha256 = function(msg) {
            var hash = CryptoJS.SHA256(msg);
            return hash.toString(CryptoJS.enc.Hex);
        };

        SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
            var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
            var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
            var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
            var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
            return kSigning;
        };

        return SigV4Utils;

    });
})();