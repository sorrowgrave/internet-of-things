/**
 * Created by Kenny on 9/05/2016.
 */


(function () {
    'use strict';

    angular.module('gatewayApp').service('LogService', function() {

        function LogMsg(type, content) {
            this.type = type;
            this.content = content;
            this.createdTime = Date.now();
            if (this.type === 'success') {
                this.className = 'list-group-item-info';
            } else {
                this.className = 'list-group-item-danger';
            }
        }

        function LogService() {
            this.logs = [];
        }

        LogService.prototype.log = function (msg) {
            var logObj = new LogMsg('success', msg);
            this.logs.push(logObj);
        };


        LogService.prototype.logError = function (msg) {
            var logObj = new LogMsg('error', msg);
            this.logs.push(logObj);
        };

        return LogService;

    });


})();